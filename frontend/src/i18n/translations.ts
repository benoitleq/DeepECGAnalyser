export type Lang = 'en' | 'fr';

export const translations = {
  en: {
    // App.tsx
    appSubtitle: 'ECG Data Analysis',
    appDescription: 'AI-powered cardiac analysis with multiple diagnostic models',
    footerAboutTitle: 'About DeepECGAnalyser',
    footerAboutText: 'This application uses the HeartWise AI engine for ECG interpretation. HeartWise provides foundation models for generalizable electrocardiogram analysis, comparing supervised and self-supervised approaches (EfficientNet, WCR) across 77 diagnostic classes. All processing is performed locally via Docker with GPU acceleration.',
    footerLocalProcessing: '100% Local Processing',

    // ECGAnalysisPanel - Header
    panelTitle: 'Complete ECG Analysis',
    panelSubtitle: 'AI cardiac diagnosis with visual results display',
    engineReady: 'AI Engine Ready',
    engineNotReady: 'AI Engine not ready',
    engineNotReadyMsg: 'Start the Docker container from the sidebar',
    panelDescription: 'Complete analysis with all models and visual results display',

    // ECGAnalysisPanel - Options
    gpuLabel: 'GPU (CUDA)',
    gpuDesc: 'Acceleration',
    batchLabel: 'Batch Mode',
    batchDesc: 'Multi-files',

    // ECGAnalysisPanel - Upload
    loadingModels: 'Loading models...',
    dropzoneMulti: 'Drop your ECG files here',
    dropzoneSingle: 'Drop your ECG file here',
    dropzoneOr: 'or click to browse',
    dropzoneFormatsSingle: 'Formats: XML, CSV, Parquet, NPY (max 100MB)',
    dropzoneFormatsBatch: 'Select multiple XML or NPY files',
    batchModeActive: 'Batch processing mode active',

    // ECGAnalysisPanel - Batch panel
    selectedFiles: 'Selected Files',
    batchProcessing: 'Batch processing',
    batchFileProgress: 'File {current} / {total}',
    batchFileProgressPct: '{pct}%',
    batchCurrentFile: 'Processing: {file}',

    // ECGAnalysisPanel - XML formats table
    xmlFormatInfo: 'XML file — automatic conversion to GE MUSE if needed',
    colFormat: 'Format',
    colManufacturer: 'Manufacturer',
    colConversion: 'Conversion',
    convNative: 'Native',
    convRepbeats: 'Repbeats + resampling',
    convDigitsScale: 'Digits + scale µV',
    convBase64: 'Base64 int16',
    formatGeMuse: 'GE MUSE RestingECG',
    mfrGe: 'GE Healthcare',
    formatPhilips: 'Philips PageWriter / TC',
    mfrPhilips: 'Philips',
    formatHl7: 'HL7 aECG (Annotated ECG)',
    mfrHl7: 'FDA Standard',
    formatCardio: 'CardiologyXML',
    mfrCardio: 'Generic',

    // ECGAnalysisPanel - Status
    modelsSelected: '{n} model(s) selected',
    gpuEnabled: 'GPU: Enabled',
    gpuDisabled: 'GPU: Disabled',

    // ECGAnalysisPanel - Buttons
    btnAnalyzeBatch: 'Run Batch Analysis ({files} files × {models} models)',
    btnAnalyzeSingle: 'Run Complete Analysis ({models} models)',
    btnAnalyzing: 'Analyzing...',
    btnAnalyzingBatchProgress: 'Processing {current}/{total} — {file}',
    btnAnalyzingBatch: 'Processing ({files} files)...',
    btnNewAnalysis: 'New Analysis',
    btnExportCsv: 'Export CSV',
    btnExportCsvTooltip: 'Export all results to CSV for research',
    btnPrevious: 'Previous',
    btnNext: 'Next',
    btnShowEcg: 'Show ECG',
    btnHideEcg: 'Hide ECG',
    btnShowTrace: 'Show ECG trace',
    btnHideTrace: 'Hide ECG trace',

    // ECGAnalysisPanel - Errors
    errorLoadModels: 'Failed to load models',
    errorInvalidFile: 'Invalid file type. Allowed: {exts}',
    errorAnalysis: 'Analysis failed',

    // ECGAnalysisPanel - Batch results
    batchInProgress: 'Batch Processing In Progress...',
    batchDone: 'Batch Processing Complete',
    batchSummary: '{success} succeeded / {total} file(s) • {time}s',
    batchFailed: '{n} failure(s)',
    batchFileHeader: 'ECG {current}/{total}: {file}',
    batchPatient: 'Patient: {id}',
    batchAnalysisFailed: 'Analysis failed',

    // ECGVisualResults - Status labels
    statusNormal: 'Normal',
    statusBorderline: 'Borderline',
    statusAbnormal: 'Abnormal',

    // ECGVisualResults - Threshold / diagnosis
    threshold: 'Threshold: {value}%',
    thresholdDetection: 'Detection threshold: {value}%',
    abnormalCount: '{n} abnormal',
    borderlineCount: '{n} borderline',

    // ECGVisualResults - Overall status
    overallNormal: 'Normal ECG',
    overallBorderline: 'Results to monitor',
    overallAbnormal: 'Anomalies detected',
    modelsExecuted: '{n} model(s) executed in {time}s',

    // ECGVisualResults - Sections
    labelPatient: 'Patient',
    criticalFindings: 'Critical findings:',
    labelModels: 'Models',
    labelNormal: 'Normal',
    labelBorderline: 'Borderline',
    labelAbnormal: 'Abnormal',
    detectedFormat: 'Detected format:',
    conversions: 'Conversions:',

    // ECGVisualResults - Tabs
    tabSummary: 'Summary',
    tabComparison: 'Comparison',
    tabByCategory: 'By category',
    tabAllResults: 'All results',

    // ECGVisualResults - Section headings
    predictionModels: 'Prediction Models',
    classification77: '77-Class Classification',
    modelsCount: '({n} models)',
    mainAbnormalFindings: 'Main abnormal findings',
    modelComparison: '77-Class Model Comparison',
    modelComparisonDesc: 'Significant differences between EfficientNet and WCR Transformer (gap >10% or anomalies)',

    // ECGVisualResults - Table headers
    colDiagnosis: 'Diagnosis',
    colCategory: 'Category',
    colProbability: 'Probability',
    colThreshold: 'Threshold',
    colStatus: 'Status',
    colDiff: 'Diff',

    // ECGVisualResults - Empty states
    noAnomalyDetected: 'No anomaly detected',
    noSignificantDiff: 'Similar results between models — no significant difference',

    // ECGVisualResults - Warnings
    reconstructedECG: 'Reconstructed ECG',
    reconstructedECGDetail: 'Leads III, aVR, aVL and aVF were calculated from leads I and II',
    errorLabel: 'Error:',

    // ECGViewer
    viewerLoading: 'Loading ECG trace...',
    viewerError: 'Error loading ECG',
    viewerFileSearched: 'File searched: {file}',
    viewerTitle: '12-Lead ECG',
    viewerBpm: 'bpm',
    viewer2s: '2.5s per lead',
    viewer5s: '5s per lead',
    viewer10s: '10s per lead',
    viewerLegendSmall: '1 small square = 0.04s (40ms) | 0.1mV',
    viewerLegendLarge: '1 large square = 0.2s (200ms) | 0.5mV',
    viewerLegendFormat: 'Format: Standard 12 leads + DII rhythm strip',

    // ModelSelector
    modelSelectorTitle: 'Model Selection',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    modelsSelectedCount: '{selected} model(s) selected out of {total}',
    archModelsCount: '({n} models)',
    modelType77: '77 Classes',
    modelTypeBinary: 'Binary',
    btnEfficientNetOnly: 'EfficientNet only',
    btnWcrOnly: 'WCR only',

    // SystemStatusPanel
    aiEngine: 'AI Engine',
    statusChecking: 'Checking...',
    statusDockerOff: 'Docker Off',
    statusStopped: 'Stopped',
    statusStarting: 'Starting...',
    statusReady: 'Ready',
    labelDocker: 'Docker',
    labelGpu: 'GPU',
    labelContainer: 'Container',
    labelEngine: 'Engine',
    detailRunning: 'Running',
    detailNotRunning: 'Not running',
    detailAvailable: 'Available',
    detailNotDetected: 'Not detected',
    detailStopped: 'Stopped',
    detailReady: 'Ready',
    detailNotReady: 'Not ready',
    btnStartEngine: 'Start Engine',
    btnStarting: 'Starting...',
    btnStopEngine: 'Stop Engine',
    btnStopping: 'Stopping...',
    btnRefreshStatus: 'Refresh status',
    labelWorkspace: 'Workspace',
    btnEdit: 'Edit',
    btnSave: 'Save',
    btnSaving: 'Saving...',
    btnCancel: 'Cancel',
    btnCreating: 'Creating...',
    btnCreateDirs: 'Create missing directories',
    stopContainerToEdit: 'Stop the container to edit the path',
    startDockerFirst: 'Please start Docker Desktop first',
    errorGetStatus: 'Failed to get status',
    errorStart: 'Failed to start engine',
    errorStop: 'Failed to stop engine',
    errorLoadConfig: 'Failed to load config',
    errorUpdateConfig: 'Failed to update config',
    errorCreateDirs: 'Failed to create directories',

    // Language toggle
    switchToFr: 'Français',
    switchToEn: 'English',
    language: 'Language',

    // ConfidenceBadge
    confidenceHigh: 'High confidence',
    confidenceMedium: 'Medium confidence',
    confidenceLow: 'Low confidence',
    confidenceAriaLabel: 'Confidence level indicator',
  },
  fr: {
    // App.tsx
    appSubtitle: '- Analyse ECG',
    appDescription: 'Analyse cardiaque par IA avec plusieurs modèles diagnostiques',
    footerAboutTitle: 'À propos de DeepECGAnalyser',
    footerAboutText: "Cette application utilise le moteur IA HeartWise pour l'interprétation d'ECG. HeartWise fournit des modèles de fondation pour l'analyse généralisable d'électrocardiogrammes, comparant des approches supervisées et auto-supervisées (EfficientNet, WCR) sur 77 classes diagnostiques. Tout le traitement est effectué localement via Docker avec accélération GPU.",
    footerLocalProcessing: 'Traitement 100% Local',

    // ECGAnalysisPanel - Header
    panelTitle: 'Analyse ECG Complète',
    panelSubtitle: 'Diagnostic cardiaque par IA avec affichage visuel des résultats',
    engineReady: 'Moteur IA Prêt',
    engineNotReady: 'Moteur IA non prêt',
    engineNotReadyMsg: 'Démarrez le conteneur Docker depuis la barre latérale',
    panelDescription: 'Analyse complète avec tous les modèles et affichage visuel des résultats',

    // ECGAnalysisPanel - Options
    gpuLabel: 'GPU (CUDA)',
    gpuDesc: 'Accélération',
    batchLabel: 'Mode Lot',
    batchDesc: 'Multi-fichiers',

    // ECGAnalysisPanel - Upload
    loadingModels: 'Chargement des modèles...',
    dropzoneMulti: 'Déposez vos fichiers ECG ici',
    dropzoneSingle: 'Déposez votre fichier ECG ici',
    dropzoneOr: 'ou cliquez pour parcourir',
    dropzoneFormatsSingle: 'Formats : XML, CSV, Parquet, NPY (max 100 Mo)',
    dropzoneFormatsBatch: 'Sélectionnez plusieurs fichiers XML ou NPY',
    batchModeActive: 'Mode traitement par lot actif',

    // ECGAnalysisPanel - Batch panel
    selectedFiles: 'Fichiers sélectionnés',
    batchProcessing: 'Traitement par lot',
    batchFileProgress: 'Fichier {current} / {total}',
    batchFileProgressPct: '{pct}%',
    batchCurrentFile: 'En cours : {file}',

    // ECGAnalysisPanel - XML formats table
    xmlFormatInfo: 'Fichier XML — Conversion automatique vers GE MUSE si nécessaire',
    colFormat: 'Format',
    colManufacturer: 'Constructeur',
    colConversion: 'Conversion',
    convNative: 'Natif',
    convRepbeats: 'Repbeats + resampling',
    convDigitsScale: 'Digits + scale µV',
    convBase64: 'Base64 int16',
    formatGeMuse: 'GE MUSE RestingECG',
    mfrGe: 'GE Healthcare',
    formatPhilips: 'Philips PageWriter / TC',
    mfrPhilips: 'Philips',
    formatHl7: 'HL7 aECG (Annotated ECG)',
    mfrHl7: 'Standard FDA',
    formatCardio: 'CardiologyXML',
    mfrCardio: 'Générique',

    // ECGAnalysisPanel - Status
    modelsSelected: '{n} modèle(s) sélectionné(s)',
    gpuEnabled: 'GPU : Activé',
    gpuDisabled: 'GPU : Désactivé',

    // ECGAnalysisPanel - Buttons
    btnAnalyzeBatch: "Lancer l'Analyse par Lot ({files} fichiers × {models} modèles)",
    btnAnalyzeSingle: "Lancer l'Analyse Complète ({models} modèles)",
    btnAnalyzing: 'Analyse en cours...',
    btnAnalyzingBatchProgress: 'Traitement {current}/{total} — {file}',
    btnAnalyzingBatch: 'Traitement en cours ({files} fichiers)...',
    btnNewAnalysis: 'Nouvelle Analyse',
    btnExportCsv: 'Exporter CSV',
    btnExportCsvTooltip: 'Exporter tous les résultats en CSV pour la recherche',
    btnPrevious: 'Précédent',
    btnNext: 'Suivant',
    btnShowEcg: 'Voir ECG',
    btnHideEcg: 'Masquer ECG',
    btnShowTrace: 'Afficher le tracé ECG',
    btnHideTrace: 'Masquer le tracé ECG',

    // ECGAnalysisPanel - Errors
    errorLoadModels: 'Échec du chargement des modèles',
    errorInvalidFile: 'Type de fichier invalide. Autorisés : {exts}',
    errorAnalysis: "Échec de l'analyse",

    // ECGAnalysisPanel - Batch results
    batchInProgress: 'Traitement par Lot en Cours...',
    batchDone: 'Traitement par Lot Terminé',
    batchSummary: '{success} réussi(s) / {total} fichier(s) • {time}s',
    batchFailed: '{n} échec(s)',
    batchFileHeader: 'ECG {current}/{total} : {file}',
    batchPatient: 'Patient : {id}',
    batchAnalysisFailed: "Échec de l'analyse",

    // ECGVisualResults - Status labels
    statusNormal: 'Normal',
    statusBorderline: 'Limite',
    statusAbnormal: 'Anormal',

    // ECGVisualResults - Threshold / diagnosis
    threshold: 'Seuil : {value}%',
    thresholdDetection: 'Seuil de détection : {value}%',
    abnormalCount: '{n} anormal(s)',
    borderlineCount: '{n} limite(s)',

    // ECGVisualResults - Overall status
    overallNormal: 'ECG Normal',
    overallBorderline: 'Résultats à surveiller',
    overallAbnormal: 'Anomalies détectées',
    modelsExecuted: '{n} modèle(s) exécuté(s) en {time}s',

    // ECGVisualResults - Sections
    labelPatient: 'Patient',
    criticalFindings: 'Résultats critiques :',
    labelModels: 'Modèles',
    labelNormal: 'Normaux',
    labelBorderline: 'Limites',
    labelAbnormal: 'Anormaux',
    detectedFormat: 'Format détecté :',
    conversions: 'Conversions :',

    // ECGVisualResults - Tabs
    tabSummary: 'Résumé',
    tabComparison: 'Comparaison',
    tabByCategory: 'Par catégorie',
    tabAllResults: 'Tous les résultats',

    // ECGVisualResults - Section headings
    predictionModels: 'Modèles de Prédiction',
    classification77: 'Classification 77 Classes',
    modelsCount: '({n} modèles)',
    mainAbnormalFindings: 'Principaux résultats anormaux',
    modelComparison: 'Comparaison des Modèles 77 Classes',
    modelComparisonDesc: 'Différences significatives entre EfficientNet et WCR Transformer (écart >10% ou anomalies)',

    // ECGVisualResults - Table headers
    colDiagnosis: 'Diagnostic',
    colCategory: 'Catégorie',
    colProbability: 'Probabilité',
    colThreshold: 'Seuil',
    colStatus: 'Statut',
    colDiff: 'Diff',

    // ECGVisualResults - Empty states
    noAnomalyDetected: 'Aucune anomalie détectée',
    noSignificantDiff: 'Résultats similaires entre les modèles — aucune différence significative',

    // ECGVisualResults - Warnings
    reconstructedECG: 'ECG Reconstruit',
    reconstructedECGDetail: 'Les dérivations III, aVR, aVL et aVF ont été calculées à partir de I et II',
    errorLabel: 'Erreur :',

    // ECGViewer
    viewerLoading: 'Chargement du tracé ECG...',
    viewerError: "Erreur de chargement de l'ECG",
    viewerFileSearched: 'Fichier recherché : {file}',
    viewerTitle: 'ECG 12 Dérivations',
    viewerBpm: 'bpm',
    viewer2s: '2.5s par dérivation',
    viewer5s: '5s par dérivation',
    viewer10s: '10s par dérivation',
    viewerLegendSmall: '1 petit carré = 0.04s (40ms) | 0.1mV',
    viewerLegendLarge: '1 grand carré = 0.2s (200ms) | 0.5mV',
    viewerLegendFormat: 'Format : Standard 12 dérivations + tracé rythmique DII',

    // ModelSelector
    modelSelectorTitle: 'Sélection des Modèles',
    selectAll: 'Tout sélectionner',
    deselectAll: 'Tout désélectionner',
    modelsSelectedCount: '{selected} modèle(s) sélectionné(s) sur {total}',
    archModelsCount: '({n} modèles)',
    modelType77: '77 Classes',
    modelTypeBinary: 'Binaire',
    btnEfficientNetOnly: 'EfficientNet uniquement',
    btnWcrOnly: 'WCR uniquement',

    // SystemStatusPanel
    aiEngine: 'Moteur IA',
    statusChecking: 'Vérification...',
    statusDockerOff: 'Docker Arrêté',
    statusStopped: 'Arrêté',
    statusStarting: 'Démarrage...',
    statusReady: 'Prêt',
    labelDocker: 'Docker',
    labelGpu: 'GPU',
    labelContainer: 'Conteneur',
    labelEngine: 'Moteur',
    detailRunning: 'En cours',
    detailNotRunning: 'Arrêté',
    detailAvailable: 'Disponible',
    detailNotDetected: 'Non détecté',
    detailStopped: 'Arrêté',
    detailReady: 'Prêt',
    detailNotReady: 'Non prêt',
    btnStartEngine: 'Démarrer',
    btnStarting: 'Démarrage...',
    btnStopEngine: 'Arrêter',
    btnStopping: 'Arrêt...',
    btnRefreshStatus: 'Rafraîchir le statut',
    labelWorkspace: 'Espace de travail',
    btnEdit: 'Modifier',
    btnSave: 'Enregistrer',
    btnSaving: 'Enregistrement...',
    btnCancel: 'Annuler',
    btnCreating: 'Création...',
    btnCreateDirs: 'Créer les répertoires manquants',
    stopContainerToEdit: 'Arrêtez le container pour modifier le chemin',
    startDockerFirst: 'Veuillez démarrer Docker Desktop en premier',
    errorGetStatus: 'Impossible de récupérer le statut',
    errorStart: 'Échec du démarrage du moteur',
    errorStop: 'Échec de l\'arrêt du moteur',
    errorLoadConfig: 'Échec du chargement de la configuration',
    errorUpdateConfig: 'Échec de la mise à jour de la configuration',
    errorCreateDirs: 'Échec de la création des répertoires',

    // Language toggle
    switchToFr: 'Français',
    switchToEn: 'English',
    language: 'Langue',

    // ConfidenceBadge
    confidenceHigh: 'Haute confiance',
    confidenceMedium: 'Confiance moyenne',
    confidenceLow: 'Faible confiance',
    confidenceAriaLabel: 'Indicateur de niveau de confiance',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
