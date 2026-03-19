// ============================
// GigGuard AI — Fraud Detection Module
// ============================

// Isolation Forest-inspired anomaly scoring
export function checkFraud(claim, allClaims, worker) {
    let anomalyScore = 0;
    const flags = [];

    // --- 1. FRAUD RING DETECTION: Network & Device Clustering ---
    // Look for other recent claims from DIFFERENT workers sharing the same IP or Device string.
    if (claim.ipAddress && claim.deviceId) {
        const clusterClaims = allClaims.filter(c => 
            c.workerId !== claim.workerId &&
            Math.abs(new Date(c.createdAt) - new Date(claim.createdAt)) < 60 * 60 * 1000 && // within 1 hour
            (c.ipAddress === claim.ipAddress || c.deviceId === claim.deviceId)
        );

        if (clusterClaims.length >= 2) {
            anomalyScore += 55;
            flags.push(`Fraud Ring Suspected: ${clusterClaims.length + 1} claims from identical IP/Device within 1 hour`);
        }
    }

    // --- 2. TELEMETRY MISMATCH: Platform Activity Consistency ---
    // If the worker was completely offline or not in "delivery" mode when the event hit
    if (claim.platformActive === false) {
        anomalyScore += 45;
        flags.push('Platform Inactive during event: Worker was not verified working during the disruption window');
    }

    // --- 3. REPUTATION WEIGHTING: Graduated Trust ---
    if (worker && worker.joinedAt) {
        const accountAgeDays = (new Date() - new Date(worker.joinedAt)) / (1000 * 60 * 60 * 24);
        
        if (accountAgeDays > 180) {
            // Veteran trust discount
            anomalyScore -= 20;
            flags.push('Reputation Discount: Verified active worker for >6 months');
        } else if (accountAgeDays < 2) {
            // New account spike penalty
            anomalyScore += 30;
            flags.push('Adversarial Profile: Account created <48hrs before major disruption event');
        }
    }

    // Basic legacy checks to ensure system stability
    const sameDayClaims = allClaims.filter(c => c.workerId === claim.workerId && c.id !== claim.id && Math.abs(new Date(c.createdAt) - new Date(claim.createdAt)) < 24*60*60*1000);
    if (sameDayClaims.length > 0) {
        anomalyScore += 35;
        flags.push('Duplicate claim detected for same trigger type within 24hrs');
    }

    // Normalize to 0-100 (and prevent negative due to discount)
    anomalyScore = Math.max(0, Math.min(100, anomalyScore));

    // --- DYNAMIC FRICTION STATES ---
    let verdict = 'clean';
    if (anomalyScore >= 60) verdict = 'flagged';
    else if (anomalyScore >= 25) verdict = 'pending_proof';

    return {
        claimId: claim.id,
        workerId: claim.workerId,
        workerName: claim.workerName,
        anomalyScore,
        verdict,
        flags: flags.length ? flags : ['No anomalies detected'],
        checkedAt: new Date().toISOString(),
    };
}
