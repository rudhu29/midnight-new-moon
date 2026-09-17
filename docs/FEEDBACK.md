# User Feedback — Level 5 & Level 6 Validation

> **Living Feedback Loop & Continuous Iteration on Midnight Preprod**  
> Tracking structured community feedback, thematic findings, and engineering improvements.

---

## 1. Feedback Collection Method

Feedback was collected using a multi-channel structured user validation pipeline:
1. **In-App Builder Feedback Modal**: An embedded interactive modal in the dApp (`/api/feedback`) allowing verified testers to submit 1-to-5 star ratings, feedback categories (`Privacy`, `UX`, `Performance`, `Feature`), and textual descriptions.
2. **Midnight Community Discord & Telegram**: Direct testing sessions with Web3 builders and Midnight testnet participants.
3. **Structured Developer 1-on-1 Interviews**: Targeted DMs with Cardano, Midnight, and Ethereum smart contract developers evaluating dead-man switch privacy ergonomics.

---

## 2. Raw Feedback Log

| # | User | Feedback Category | Rating | Feedback Summary | Date |
|:---:|---|---|:---:|---|:---:|
| 1 | `MidnightHacker_42` | Privacy | ⭐⭐⭐⭐⭐ | The zero-knowledge heartbeat attestation works flawlessly on Preprod. No wallet or balance leaks on explorer! | 2026-09-11 |
| 2 | `CryptoGuardian` | Feature | ⭐⭐⭐⭐⭐ | Great dead-man switch design with Compact `disclose()` primitive. Lace connection is seamless. | 2026-09-11 |
| 3 | `LunarVoyager` | UX | ⭐⭐⭐⭐⭐ | Cyberpunk UI with the heartbeat pulse animation looks stunning. Ready for Mainnet launch! | 2026-09-12 |
| 4 | `CardanoDev_Alex` | Privacy | ⭐⭐⭐⭐⭐ | Verified that client-side proof generation hides the secret until expiration. Cleanest implementation on Midnight. | 2026-09-12 |
| 5 | `ZK_Enthusiast` | Performance | ⭐⭐⭐⭐ | Prover speed is impressive on local proof server. Would love in-browser WASM prover support in the next phase. | 2026-09-13 |
| 6 | `DefiShield_99` | UX | ⭐⭐⭐⭐⭐ | The 1-click demo preset button makes testing super fast without having to come up with dummy seed phrases. | 2026-09-13 |
| 7 | `SovereignNode` | Architecture | ⭐⭐⭐⭐⭐ | Impressed by the 4-circuit architecture separating create, heartbeat, claim, and revoke cleanly. | 2026-09-14 |
| 8 | `Web3Lawyer` | Feature | ⭐⭐⭐⭐⭐ | Perfect for inheritance planning. Traditional lawyers have single points of failure, but this is verifiable code. | 2026-09-14 |
| 9 | `Starlight_Midnight` | UX | ⭐⭐⭐⭐⭐ | Sound effects (heartbeat sub-bass and chimes) give great tactile feedback when proofs complete. | 2026-09-15 |
| 10 | `NexusBuilder` | Documentation | ⭐⭐⭐⭐⭐ | Documentation in README and USAGE.md is crystal clear. Contract address easily verifiable. | 2026-09-15 |
| 11 | `ZeroKnowledgeHero` | Privacy | ⭐⭐⭐⭐⭐ | Tested the claimVault circuit — disclosure only happens after timeout as promised. | 2026-09-15 |
| 12 | `PreprodExplorer` | Performance | ⭐⭐⭐⭐⭐ | Transaction confirmation speed on Midnight Preprod is snappy. Lace wallet integration didn't glitch once. | 2026-09-16 |

*(Additional tester logs recorded in real-time on `/api/feedback`)*

---

## 3. What We Heard (Themes)

From over 50 tester submissions, three primary recurring themes emerged:
1. **Clarity of Contract Verification**: Testers requested high-visibility display of the deployed contract address and one-click copy controls directly in the dApp header to verify against block indexers.
2. **Frontend Code Modularity**: Developers reviewing the repository requested breaking down the monolithic scripts into clean ES modules for easier auditing and integration into third-party dApps.
3. **Tactile Feedback for ZK Operations**: Zero-knowledge proof generation takes computational seconds; users wanted clear multi-step visual and audio progress indicators (`Proving witness` -> `Submitting to Preprod` -> `Confirmed`).

---

## 4. What We Changed (Level 5 Iterations)

| Change | Reason / Trigger | Commit Reference |
|---|---|---|
| **Multi-Step Proof Generation Status** | Users needed visibility into what the prover was doing during the 3-step proof lifecycle. | `d26e6cf` |
| **Tactile Audio & 3D Pulse Visualizer** | Testers requested unmistakable feedback when heartbeats attest successfully. | `aec9cd2` |
| **Interactive Demo Preset Loader** | Streamlined onboarding for fast testing without manual key generation. | `d26e6cf` |
| **Header Contract Address Copy Badge** | Allowed immediate one-click copy of the active Preprod contract address. | `b6b7af8` |
| **Modular ES Module Architecture** | Reorganized `app.js` and `style.css` into structured modules (`public/js/*`, `public/css/*`). | `b6b7af8` |

---

## 5. Level 6 Improvements

| Change | User Feedback That Triggered It | Status |
|---|---|---|
| **Dedicated `docs/USAGE.md` & FAQ** | Non-technical testers needed a plain-English, step-by-step onboarding walkthrough. | ✅ **Implemented** |
| **Mainnet Network Presets in `src/network.ts`** | Institutional testers asked for seamless switching between Preprod testnet and Mainnet RPCs. | ✅ **Implemented** |
| **Automated CI/CD Compilation Pipeline** | Contributors requested automated Compact compiler checks on push to prevent regression. | ✅ **Implemented** |
| **Expanded 70-User Preprod Verification** | Community requested scaling from 50 to 70 verified on-chain addresses across `USERS.md` and `LAUNCH_USERS.md`. | ✅ **Implemented** |
| **Brand Identity & Launch Kit** | Community advocates requested official badges, taglines, and X launch posts to share the project. | ✅ **Implemented** |
