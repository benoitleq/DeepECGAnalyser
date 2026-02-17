"""
AI Engine client for DeepECG analysis.

This module handles communication with the DeepECG AI Engine running in Docker.
Supports health checks and file analysis (CSV/parquet).
"""
import httpx
import logging
import time
from typing import Dict, Any, Optional, BinaryIO
from dataclasses import dataclass
from pathlib import Path

from .settings import settings
from .exceptions import AIEngineError

logger = logging.getLogger(__name__)


@dataclass
class HealthCheckResult:
    """Result of an AI Engine health check."""
    status: str  # "healthy", "unhealthy", "unreachable"
    latency_ms: float
    engine_url: str
    details: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@dataclass
class AnalysisResult:
    """Result of an AI Engine analysis."""
    success: bool
    job_id: Optional[str] = None
    outputs: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    processing_time_ms: float = 0


async def check_ai_engine_health(request_id: str = "") -> HealthCheckResult:
    """
    Check if the AI Engine is accessible and healthy.

    Args:
        request_id: Optional correlation ID for logging

    Returns:
        HealthCheckResult with status, latency, and details
    """
    url = f"{settings.AI_ENGINE_URL}/health"
    start_time = time.time()

    log_prefix = f"[{request_id}] " if request_id else ""
    logger.info(f"{log_prefix}Checking AI Engine health at {url}")

    try:
        async with httpx.AsyncClient(timeout=settings.AI_ENGINE_HEALTH_TIMEOUT) as client:
            response = await client.get(url)
            latency_ms = (time.time() - start_time) * 1000

            if response.status_code == 200:
                try:
                    details = response.json()
                except Exception:
                    details = {"raw_response": response.text[:500]}

                logger.info(
                    f"{log_prefix}AI Engine healthy - latency: {latency_ms:.1f}ms"
                )
                return HealthCheckResult(
                    status="healthy",
                    latency_ms=latency_ms,
                    engine_url=settings.AI_ENGINE_URL,
                    details=details
                )
            else:
                logger.warning(
                    f"{log_prefix}AI Engine unhealthy - status: {response.status_code}"
                )
                return HealthCheckResult(
                    status="unhealthy",
                    latency_ms=latency_ms,
                    engine_url=settings.AI_ENGINE_URL,
                    error=f"HTTP {response.status_code}: {response.text[:200]}"
                )

    except httpx.TimeoutException:
        latency_ms = (time.time() - start_time) * 1000
        logger.error(f"{log_prefix}AI Engine health check timeout after {latency_ms:.1f}ms")
        return HealthCheckResult(
            status="unreachable",
            latency_ms=latency_ms,
            engine_url=settings.AI_ENGINE_URL,
            error=f"Timeout after {settings.AI_ENGINE_HEALTH_TIMEOUT}s"
        )

    except httpx.ConnectError as e:
        latency_ms = (time.time() - start_time) * 1000
        logger.error(f"{log_prefix}AI Engine connection failed: {e}")
        return HealthCheckResult(
            status="unreachable",
            latency_ms=latency_ms,
            engine_url=settings.AI_ENGINE_URL,
            error=f"Connection failed: Unable to connect to {settings.AI_ENGINE_URL}"
        )

    except Exception as e:
        latency_ms = (time.time() - start_time) * 1000
        logger.error(f"{log_prefix}AI Engine health check error: {e}")
        return HealthCheckResult(
            status="unreachable",
            latency_ms=latency_ms,
            engine_url=settings.AI_ENGINE_URL,
            error=str(e)
        )


async def analyze_file(
    file_content: bytes,
    filename: str,
    model_id: Optional[str] = None,
    request_id: str = ""
) -> Dict[str, Any]:
    """
    Send a file to the AI Engine for analysis.

    Args:
        file_content: Raw file bytes
        filename: Original filename (must be .csv or .parquet)
        model_id: Specific model to use (None for default/all)
        request_id: Correlation ID for logging

    Returns:
        Dict with success, outputs, error, and processing_time_ms

    Raises:
        AIEngineError: If analysis fails after retries
    """
    # Build URL based on model_id
    if model_id:
        url = f"{settings.AI_ENGINE_URL}/predict/{model_id}"
    else:
        url = f"{settings.AI_ENGINE_URL}/analyze"
    log_prefix = f"[{request_id}] " if request_id else ""

    # Validate file extension
    file_ext = Path(filename).suffix.lower()
    if file_ext not in settings.ALLOWED_DATA_EXTENSIONS:
        error_msg = f"Invalid file extension: {file_ext}. Allowed: {settings.ALLOWED_DATA_EXTENSIONS}"
        logger.warning(f"{log_prefix}{error_msg}")
        return {
            "success": False,
            "error": error_msg
        }

    # Determine content type
    content_type = "text/csv" if file_ext == ".csv" else "application/octet-stream"

    start_time = time.time()
    last_error = None

    for attempt in range(1, settings.AI_ENGINE_MAX_RETRIES + 1):
        try:
            logger.info(
                f"{log_prefix}Sending file to AI Engine (attempt {attempt}/{settings.AI_ENGINE_MAX_RETRIES}): "
                f"{filename} ({len(file_content)} bytes)"
            )

            async with httpx.AsyncClient(timeout=settings.AI_ENGINE_TIMEOUT) as client:
                # Prepare multipart form data
                files = {
                    "file": (filename, file_content, content_type)
                }

                response = await client.post(url, files=files)
                processing_time_ms = (time.time() - start_time) * 1000

                if response.status_code == 200:
                    try:
                        result_data = response.json()
                    except Exception as e:
                        logger.error(f"{log_prefix}Failed to parse AI Engine response: {e}")
                        return {
                            "success": False,
                            "error": "Invalid JSON response from AI Engine",
                            "processing_time_ms": processing_time_ms
                        }

                    job_id = result_data.get("job_id", result_data.get("id", "unknown"))

                    logger.info(
                        f"{log_prefix}Analysis complete - job_id: {job_id}, "
                        f"model: {model_id or 'default'}, time: {processing_time_ms:.1f}ms"
                    )

                    return {
                        "success": True,
                        "job_id": job_id,
                        "outputs": result_data,
                        "processing_time_ms": processing_time_ms
                    }

                elif response.status_code == 422:
                    # Validation error - don't retry
                    error_msg = f"Validation error: {response.text[:500]}"
                    logger.warning(f"{log_prefix}{error_msg}")
                    return {
                        "success": False,
                        "error": error_msg,
                        "processing_time_ms": processing_time_ms
                    }

                else:
                    last_error = f"HTTP {response.status_code}: {response.text[:200]}"
                    logger.warning(f"{log_prefix}AI Engine error: {last_error}")

        except httpx.TimeoutException:
            processing_time_ms = (time.time() - start_time) * 1000
            last_error = f"Timeout after {settings.AI_ENGINE_TIMEOUT}s"
            logger.warning(f"{log_prefix}AI Engine timeout on attempt {attempt}")

        except httpx.ConnectError as e:
            processing_time_ms = (time.time() - start_time) * 1000
            last_error = f"Connection failed: {e}"
            logger.warning(f"{log_prefix}AI Engine connection error on attempt {attempt}: {e}")

        except Exception as e:
            processing_time_ms = (time.time() - start_time) * 1000
            last_error = str(e)
            logger.error(f"{log_prefix}Unexpected error on attempt {attempt}: {e}")

        # Wait before retry (except on last attempt)
        if attempt < settings.AI_ENGINE_MAX_RETRIES:
            await _async_sleep(settings.AI_ENGINE_RETRY_DELAY)

    # All retries exhausted
    processing_time_ms = (time.time() - start_time) * 1000
    error_msg = f"AI Engine unreachable after {settings.AI_ENGINE_MAX_RETRIES} attempts. Last error: {last_error}"
    logger.error(f"{log_prefix}{error_msg}")

    return {
        "success": False,
        "error": error_msg,
        "processing_time_ms": processing_time_ms
    }


async def _async_sleep(seconds: float):
    """Async sleep helper."""
    import asyncio
    await asyncio.sleep(seconds)


def get_engine_info() -> Dict[str, Any]:
    """Get current AI Engine configuration info."""
    return {
        "url": settings.AI_ENGINE_URL,
        "timeout": settings.AI_ENGINE_TIMEOUT,
        "health_timeout": settings.AI_ENGINE_HEALTH_TIMEOUT,
        "max_retries": settings.AI_ENGINE_MAX_RETRIES,
        "allowed_extensions": settings.ALLOWED_DATA_EXTENSIONS
    }
