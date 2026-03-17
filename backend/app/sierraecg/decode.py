"""
Decode Philips Sierra ECG XML — parsedwaveforms (XLI) and repbeats.

Used by philips_converter.py to extract the real 10-second rhythm instead of
the 1.2-second representative beat (repbeat).
"""

import base64
import struct
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Tuple

import numpy as np

from .xli import xli_decode

LEAD_ORDER_12 = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"]


# ─────────────────────────────────────────────────────────────────────────────
# XML helpers (namespace-agnostic)
# ─────────────────────────────────────────────────────────────────────────────

def _local(tag: str) -> str:
    """Return local tag name, stripping namespace."""
    return tag.split('}', 1)[1] if '}' in tag else tag


def _find(root: ET.Element, local_name: str) -> Optional[ET.Element]:
    """Find first element whose local name matches (case-insensitive)."""
    target = local_name.lower()
    for elem in root.iter():
        if _local(elem.tag).lower() == target:
            return elem
    return None


def _attr(elem: ET.Element, *names: str, default: Optional[str] = None) -> Optional[str]:
    """Get attribute by any of the given names (case-insensitive)."""
    attrs = {k.lower(): v for k, v in elem.attrib.items()}
    for name in names:
        if name.lower() in attrs:
            return attrs[name.lower()]
    return default


# ─────────────────────────────────────────────────────────────────────────────
# Philips limb-lead correction
# ─────────────────────────────────────────────────────────────────────────────

def _correct_limb_leads(leads: Dict[str, np.ndarray]) -> None:
    """Apply Philips-specific limb-lead reconstruction in-place."""
    if not all(k in leads for k in ('I', 'II', 'III')):
        return

    i32 = np.int32
    lead_i  = leads['I'].astype(i32)
    lead_ii = leads['II'].astype(i32)
    lead_iii_raw = leads['III'].astype(i32)

    leads['III'] = (lead_ii - lead_i - lead_iii_raw).astype(np.int16)
    iii = leads['III'].astype(i32)

    if 'aVR' in leads:
        avr = leads['aVR'].astype(i32)
        leads['aVR'] = (-avr - (lead_i + lead_ii) // 2).astype(np.int16)

    if 'aVL' in leads:
        avl = leads['aVL'].astype(i32)
        leads['aVL'] = ((lead_i - iii) // 2 - avl).astype(np.int16)

    if 'aVF' in leads:
        avf = leads['aVF'].astype(i32)
        leads['aVF'] = ((lead_ii + iii) // 2 - avf).astype(np.int16)


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

def decode_rhythm(xml_path: str) -> Tuple[Dict[str, np.ndarray], int]:
    """
    Decode the full rhythm strip from Philips Sierra parsedwaveforms (XLI-compressed).

    Returns
    -------
    leads : dict  lead_label -> np.ndarray(int16)
    sampling_rate : int  (Hz, typically 500)

    Raises
    ------
    ValueError  if the section is missing or uses an unsupported format.
    """
    tree = ET.parse(xml_path)
    root = tree.getroot()

    # Sampling rate
    signal_chars = _find(root, 'signalcharacteristics')
    if signal_chars is None:
        raise ValueError("signalcharacteristics not found")
    sr_elem = _find(signal_chars, 'samplingrate')
    if sr_elem is None:
        raise ValueError("samplingrate not found")
    sampling_rate = int(sr_elem.text.strip())

    # parsedwaveforms element
    parsed_wf = _find(root, 'parsedwaveforms')
    if parsed_wf is None:
        raise ValueError("parsedwaveforms not found")

    encoding = _attr(parsed_wf, 'dataencoding', default='Base64')
    # Some Philips devices use 'samplespersecond' on parsedwaveforms instead of signalcharacteristics
    sr_override = _attr(parsed_wf, 'samplespersecond')
    if sr_override:
        sampling_rate = int(sr_override)

    compression = _attr(parsed_wf, 'compressmethod', 'compression', default='Uncompressed')
    duration_ms  = int(_attr(parsed_wf, 'durationperchannel', default='0'))
    n_leads_attr = int(_attr(parsed_wf, 'numberofleads', default='0'))
    lead_labels_str = _attr(parsed_wf, 'leadlabels', default='')

    # Build lead label list
    if lead_labels_str:
        labels = lead_labels_str.split()
        if n_leads_attr > 0:
            labels = labels[:n_leads_attr]
    else:
        labels = _default_labels(signal_chars, n_leads_attr)

    n_samples = int(duration_ms * sampling_rate / 1000) if duration_ms > 0 else 0

    # ── Plain encoding: whitespace-separated integers (no compression) ────────
    if encoding.lower() == 'plain':
        all_ints = [int(v) for v in (parsed_wf.text or '').split()]
        if n_samples == 0 and len(labels) > 0:
            n_samples = len(all_ints) // len(labels)
        lead_arrays = [
            np.array(all_ints[i * n_samples:(i + 1) * n_samples], dtype=np.int16)
            for i in range(len(labels))
        ]
    elif encoding != 'Base64':
        raise ValueError(f"Unsupported encoding: {encoding}")
    else:
        # Base64 decode then decompress
        raw_bytes = base64.b64decode(''.join((parsed_wf.text or '').split()))

        if compression.upper() == 'XLI':
            lead_arrays = xli_decode(raw_bytes, labels)
        elif compression.lower() in ('uncompressed', ''):
            if n_samples == 0:
                n_samples = len(raw_bytes) // 2 // max(len(labels), 1)
            lead_arrays = _split_uncompressed(raw_bytes, len(labels), n_samples)
        else:
            raise ValueError(f"Unsupported compression: {compression}")

    leads = {label: arr.astype(np.int16) for label, arr in zip(labels, lead_arrays)}
    # Limb-lead correction applies only to XLI/Base64 (differential encoding).
    # Plain encoding stores final physical values — no correction needed.
    if encoding.lower() != 'plain':
        _correct_limb_leads(leads)
    return leads, sampling_rate


def decode_repbeats(xml_path: str) -> Tuple[Dict[str, List[int]], int]:
    """
    Decode representative (median) beats from the Philips repbeats section.
    These are plain Base64, no XLI compression.

    Returns
    -------
    repbeats : dict  lead_label -> list[int]
    sampling_rate : int  (Hz, typically 1000)
    """
    tree = ET.parse(xml_path)
    root = tree.getroot()

    repbeats_elem = _find(root, 'repbeats')
    if repbeats_elem is None:
        return {}, 1000

    sampling_rate = int(_attr(repbeats_elem, 'samplespersec', default='1000'))
    lead_data: Dict[str, List[int]] = {}

    encoding = _attr(repbeats_elem, 'dataencoding', default='Base64')

    for elem in repbeats_elem.iter():
        if _local(elem.tag).lower() == 'repbeat':
            lead_name = elem.get('leadname', '')
            if not lead_name:
                continue
            wf_elem = next(
                (c for c in elem if _local(c.tag).lower() == 'waveform'), None
            )
            if wf_elem is not None and wf_elem.text:
                try:
                    if encoding.lower() == 'plain':
                        samples = [int(v) for v in wf_elem.text.split()]
                        lead_data[lead_name] = samples
                    else:
                        raw = base64.b64decode(''.join(wf_elem.text.split()))
                        n = len(raw) // 2
                        lead_data[lead_name] = list(struct.unpack(f'<{n}h', raw))
                except Exception:
                    pass

    return lead_data, sampling_rate


# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────

def _split_uncompressed(data: bytes, n_leads: int, n_samples: int) -> List[np.ndarray]:
    all_s = np.frombuffer(data, dtype=np.int16)
    return [all_s[i * n_samples:(i + 1) * n_samples].copy() for i in range(n_leads)]


def _default_labels(signal_chars: ET.Element, n_leads: int) -> List[str]:
    mapping = {
        1: 'I', 2: 'II', 3: 'III', 4: 'aVR', 5: 'aVL', 6: 'aVF',
        7: 'V1', 8: 'V2', 9: 'V3', 10: 'V4', 11: 'V5', 12: 'V6',
    }
    n = n_leads
    for child in signal_chars:
        if _local(child.tag).lower() == 'numberchannelsallocated' and child.text:
            n = int(child.text.strip())
            break
    return [mapping.get(i + 1, f'Ch{i + 1}') for i in range(n)]
