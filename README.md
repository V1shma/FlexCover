# FlexCover AI — Gig Worker Income Protection

FlexCover AI is an automated, parametric micro-insurance platform designed to protect gig workers from localized disruptions like extreme weather. By relying on deterministic trigger points rather than manual claims, FlexCover aims to be an instantaneous lifeline, not an arduous claims process.

## Adversarial Defense & Anti-Spoofing Strategy

We recognize that any predictable payout system is an immediate target for organized exploitation. 
Our defense relies on dynamic friction, unforgeable environmental data, and synthetic telemetry clustering rather than brittle boundary fences.

### 1. Spotting the Faker vs. the Genuinely Stranded
To separate genuine claims from opportunistic spoofing, we correlate **behavioral telemetry** with **environmental truth**:
*   **The Environmental Truth Check:** We do not rely exclusively on the worker's device to say "it is flooded here." Claims are cross-referenced with immutable external disruption sensors (e.g., municipal water gauges or satellite weather API grids). If the environment was clear in their geofence, the claim is instantly challenged.
*   **The Telemetry Check:** A genuinely stranded worker’s device will show an abrupt cessation of transit velocity, followed by prolonged stationary status within the hazard border. A faker attempting to claim from outside the zone will either show a sudden disappearance of GPS telemetry right before claiming, or transit speeds that are impossible to maintain in a flooded area.
*   **Platform Activity Consistency:** Fakers often attempt to double-dip by keeping their platform (Uber/Zomato) active outside the zone while claiming to be stuck inside the hazard. We check for ongoing successful gig completion immediately following the "stranded" event timestamp.

### 2. Catching Fraud Rings (The 500-Partner Spoof)
Fraud rings operate at synthetic scale. They cannot mimic organic chaos. We detect them via **multidimensional clustering**:
*   **Network & Device Clustering:** A coordinated ring simulating 500 workers will often route through identical or sequentially rotating IP blocks, use virtual emulators instead of physical phones, or share the same physical device ID (IMEI/MAC). Claims sharing deep hardware or network footprints within milliseconds are grouped as a single attack.
*   **Temporal & Geospatial Impossibility:** Honest claims trickle organically as individuals realize they are trapped. A ring injects automated, massive spikes simultaneously. Furthermore, if dozens of policyholders report being stranded at the *exact same GPS coordinate* (to the fifth decimal), it is a synthetic location spoofing attack, as genuine crowds produce randomized locational scatter plots.
*   **Financial Sinks:** If 100 supposedly independent workers dictate payouts to the same UPI ID, digital wallet, or routing node, it constitutes centralized fraud management.

### 3. Flagging Bad Actors Without Punishing Honest Ones
We reject binary "Approve/Deny" boundaries which often catch honest workers in the crossfire, deploying instead a **graduated trust & dynamic friction model**:
*   **Dynamic Friction over Hard Denials:** When our system flags an anomaly (e.g., GPS was turned off during the storm), we do not summarily deny the claim. Instead, we introduce *friction*. The 95% of claims with perfect corroboration are fast-tracked for instant 60-second payouts. The anomalous 5% are routed to a "Pending Review" queue or receive automated requests for secondary proof (e.g., "Please submit a photo of the flooded street"). The burden of proof only shifts when behavior is suspicious.
*   **Historical Reputation Weighting:** We weigh the anomaly score against a worker's historical footprint. A worker who has completed thousands of verifiable gigs over 6 months without ever filing a claim receives a massive "benefit of the doubt" multiplier. Conversely, a brand-new account created 12 hours prior to a catastrophic forecast, instantly filing a maximum claim, is subjected to maximum friction.
*   **Parametric Defaults:** Honest workers never fight to prove they were affected. Because our core execution is parametric—paying out automatically if the environmental sensor hits a threshold—the baseline assumption is truth. We only interrupt the payout if the worker's individual telemetry *actively contradicts* the parametric assumption.
