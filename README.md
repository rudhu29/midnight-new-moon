# 🌙 Nocturne Vault: Confidential Secret & Dead-Man's Switch on Midnight

[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20%2F%20Mainnet-7f00ff?style=for-the-badge&logo=moon)](https://midnight.network)
[![Compact Compiler](https://img.shields.io/badge/Compact-0.5.1-00f2fe?style=for-the-badge)](https://midnight.network)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated%20Pipeline-00ff87?style=for-the-badge&logo=githubactions)](https://github.com/rudhu29/midnight-new-moon/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-4facfe?style=for-the-badge)](LICENSE)

> A confidential zero-knowledge secret locker & verifiable dead-man's switch on the Midnight Network.  
> **"Start in the dark. Protect what matters. Disclose in the light."**

---

## 🌐 Live Demo

👉 **[https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app)**

---

## 📜 Contract Address (MANDATORY)

| Network | Contract Address | Deployer Wallet Address | Status |
|:---:|---|---|:---:|
| **Midnight Preprod** | `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71` | `mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke` | ✅ **Verified & Deployed** |
| **Local Devnet** | `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71` | `mn_addr_undeployed1h3ssm5ru2t6eqy4g3she78zlxn96e36ms6pq996aduvmateh9p9sk96u7s` | ✅ **Verified in Docker** |

- **Deployed Timestamp**: `2026-09-10T14:15:00.000Z`
- **Network ID**: `preprod`
- **Compact Contract**: [`contracts/nocturne-vault.compact`](contracts/nocturne-vault.compact)
- **Preprod Faucet URL**: [https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev)

---

## 💡 What This Product Does

In decentralized finance and self-custody, billions of dollars in Bitcoin, Cardano, Ethereum, and digital credentials remain permanently lost if a holder becomes incapacitated or passes away. Existing blockchain inheritance solutions suffer from a fatal flaw: **transparent ledgers leak privacy**. Observers can see vault balances, deposit intervals, owner-beneficiary relationships, and liveness activity.

**Nocturne Vault** solves this through Midnight's native zero-knowledge dual-state architecture. Using Compact smart contracts:
1. **Private by Default**: Secret payloads, beneficiary keys, and authorization witnesses remain strictly on the client machine.
2. **ZK Liveness Attestation**: The vault owner submits periodic **ZK Heartbeats** proving they are alive without revealing their account balance or identity.
3. **Selective Declassification**: The Compact `disclose()` directive is invoked intentionally only if the inactivity threshold passes, allowing the designated beneficiary to unlock the secret.

Nocturne Vault serves crypto holders managing succession plans, DAO multisig signers holding emergency recovery keys, and whistleblowers or journalists requiring verifiable "release-on-silence" disclosure mechanisms.

---

## 🔒 Privacy Model

- **What is PUBLIC (on-chain, anyone can see)**:
  - `vaultActive`: Boolean flag indicating whether the vault is locked and monitoring liveness.
  - `vaultOwnerCommitment`: 32-byte cryptographic SHA-256 hash commitment of secret and authorization salt.
  - `heartbeats`: Verified counter incremented upon each valid zero-knowledge liveness proof.
  - `secretPayload`: Disclosed to the public ledger only upon valid `claimVault` execution after timelock expiration.
- **What is PRIVATE (private witness, never on-chain)**:
  - Raw secret payload (private keys, seed phrases, emergency recovery instructions, legal wills).
  - Owner authorization key witness used to prove liveness.
  - Beneficiary authentication key witness.
  - Account balances, wallet identity, and transaction schedules.
- **What the user PROVES without revealing**:
  - The user proves ownership of the secret key corresponding to `vaultOwnerCommitment` without exposing the key.
  - The user proves liveness and authorization to increment the heartbeat counter without exposing their account identity or asset balances.
  - The beneficiary proves that the inactivity threshold has lapsed before triggering selective declassification via `disclose()`.

---

## 🛡️ Privacy Claim

> **Specific Statement: What an on-chain observer sees vs. cannot see:**
> - **An on-chain observer SEES**: A 32-byte hexadecimal contract commitment, a public counter incrementing by 1 when a heartbeat transaction is confirmed, and a boolean status flag.
> - **An on-chain observer CANNOT SEE**: The secret payload contents, the identity or wallet balance of the vault owner, the identity of the designated beneficiary, the cryptographic private keys, or any metadata linking the heartbeat transaction to the owner's real-world identity.

---

## 🛠️ Tech Stack

- **Blockchain**: Midnight Network (Dual-State Zero-Knowledge Ledger)
- **Smart Contract Language**: Compact v0.5.1 / Compact Runtime v0.16.0
- **Client Libraries**: Midnight.js SDK (`@midnight-ntwrk/midnight-js-contracts`, `@midnight-ntwrk/wallet-sdk`)
- **Prover & Verifier**: Midnight Proof Server (`midnightnetwork/proof-server:latest`, `httpClientProofProvider`)
- **Frontend Architecture**: Modular ES6 Modules (`public/js/*`), Modular CSS Design System (`public/css/*`), Three.js 3D Lunar Engine
- **Wallet Connector**: Midnight Lace Wallet (`window.midnight.mnLace`)
- **Backend & Serverless**: Express.js, TypeScript, Node.js v22
- **Testing & Toolchain**: Automated TS Test Runner, Docker Compose, GitHub Actions CI/CD

---

## 📋 Prerequisites

- **Midnight Lace Wallet Extension**: Installed on Chrome/Brave/Edge ([https://www.lace.io/](https://www.lace.io/))
- **Node.js**: >= 22.0.0 (Tested on Node v22.x & v24.x)
- **Docker & Docker Compose**: v2+ (For local proof-server and devnet)
- **Compact Compiler**: v0.5.1 (`compact --version`)

---

## 🚀 Setup & Run Locally

```bash
# 1. Clone repository
git clone https://github.com/rudhu29/midnight-new-moon.git
cd midnight-new-moon/new-moon-app

# 2. Install dependencies
npm install

# 3. Run automated test suite (11/11 tests pass)
npm test

# 4. Start local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser with Midnight Lace Wallet installed.

---

## 🧪 Run Tests

```bash
npm test
```
```
======================================================
   Midnight Network Test Suite - Nocturne Vault
======================================================

--- Contract Source Specifications ---
  ✓ hello-world.compact source exists and defines storeMessage (0ms)
  ✓ nocturne-vault.compact source exists and defines 4 confidential circuits (0ms)

--- Managed ZK Circuits & Cryptographic Keys ---
  ✓ Managed artifacts compiler metadata for Nocturne Vault contains all 4 circuits (0ms)
  ✓ All 4 ZKIR circuits are generated and non-empty (1ms)
  ✓ Proving and verifying keys generated for all 4 circuits (2ms)
  ✓ Compiled Nocturne Vault TypeScript runtime bindings are importable (41ms)

--- Network, Wallet & Multi-Phase Infrastructure ---
  ✓ Supported network configurations support Devnet, Preview, Preprod, and Mainnet (0ms)
  ✓ Active network resolution succeeds and falls back gracefully (0ms)
  ✓ Unshielded native token helper returns valid token descriptor (1ms)

--- Confidential State & Vault Semantics ---
  ✓ Vault payload serialization maintains byte integrity under disclose (0ms)
  ✓ Commitment hash derivation produces valid 32-byte representation (0ms)

------------------------------------------------------
Test Results: 11/11 passed (0 failed)
------------------------------------------------------
🎉 All Nocturne Vault tests passed successfully!
```

---

## ⚙️ CI/CD Pipeline

Automated via GitHub Actions in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
- **Triggers**: On every `push` to `main` and all `pull_request` events.
- **Workflow Pipeline Steps**:
  1. Checks out repository code.
  2. Sets up Node.js v22 environment.
  3. Installs dependencies (`npm ci`).
  4. Downloads and configures the latest Compact compiler toolchain.
  5. Validates managed ZK circuit artifacts and proving/verifying keys.
  6. Executes the 11/11 automated unit test suite (`npm test`).
  7. Validates full TypeScript type safety (`npx tsc --noEmit`).

---

## 📖 Usage Guide

Comprehensive user onboarding and transaction tutorials are documented in:  
👉 **[`docs/USAGE.md`](docs/USAGE.md)** (Step-by-step guide, wallet funding, first transaction, and troubleshooting).

---

## 📄 Product Proposal

Full product idea proposal and architectural specifications for the Midnight Monthly Moonshots:  
👉 **[`PROPOSAL.md`](PROPOSAL.md)** (Target personas, why Midnight comparison, data model, and 4-phase roadmap).

---

## 🐦 Product X Profile

Follow project updates and building-in-public threads on X:  
👉 **[@NocturneVault on X](https://x.com/NocturneVault)** (Launch posts & campaign materials in [`docs/MARKETING_AND_ONBOARDING.md`](docs/MARKETING_AND_ONBOARDING.md)).

---

## 👥 Level 5 — User Validation

- **Target**: 50 verified Preprod users
- **Current Count**: **50 / 50 Verified Preprod Users**
- **Wallet Address Log**: See [`USERS.md`](USERS.md) for the complete list of 50 verifiable `mn_addr_preprod1...` addresses.
- **Feedback Documentation**: See [`docs/FEEDBACK.md`](docs/FEEDBACK.md) for the living feedback log, rating breakdown, and implemented iterations.

---

## 🚀 Level 6 Users & Supermoon Milestone

- **Target**: 20 verified launch users (Total Community: **70 Verified Preprod Users**)
- **Launch Cohort Log**: See [`LAUNCH_USERS.md`](LAUNCH_USERS.md) for the 20 onboarded launch wallet addresses.
- **Level 6 Improvements**: See [`docs/FEEDBACK.md`](docs/FEEDBACK.md#5-level-6-improvements) for the completed Supermoon enhancements.

---

## 💬 Feedback & Iterations

Community feedback is continuously ingested via the in-app modal (`/api/feedback`). Key iterations implemented based on user input:
1. **Multi-Step ZK Status Loader**: Real-time progress updates during local zk-SNARK witness generation.
2. **Interactive Demo Preset**: 1-click preset button for effortless trial transactions.
3. **Tactile Sound & 3D Pulse Visualizer**: Web Audio API synthesis providing acoustic confirmation on proof submission.
4. **Header Contract Address Badge**: Instant 1-click clipboard copy for block explorer verification.
5. **Modular ES Module Refactor**: Clean separation into `public/js/*` and `public/css/*`.

---

## 🎨 Brand Assets & Brief

- **Tagline**: *"Start in the dark. Protect what matters. Disclose in the light."*
- **Color Palette**: Lunar Void (`#06070d`), Electric Cyan (`#00f2fe`), Luminescence Violet (`#4facfe`), Verified Emerald (`#00f5a0`).
- **Brand Brief & Onboarding Scripts**: See [`docs/MARKETING_AND_ONBOARDING.md`](docs/MARKETING_AND_ONBOARDING.md).

---

## 🎥 Demo Video & Walkthrough

The product walkthrough demonstrates:
1. Midnight Lace Wallet connection on Preprod.
2. Creating a confidential vault with local ZK proof generation.
3. Submitting an on-chain ZK Heartbeat with counter increment.
4. Selective emergency disclosure via `disclose()` upon expiration.
5. Verification that private inputs never leak to the public ledger.

---

## 📦 Project Structure

```
new-moon-app/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Level 3: GitHub Actions CI/CD pipeline
├── contracts/
│   ├── nocturne-vault.compact      # Multi-circuit Compact smart contract
│   ├── hello-world.compact         # Baseline Compact contract
│   └── managed/                    # Generated ZK artifacts (circuits + keys)
│       └── nocturne-vault/
│           ├── compiler/           # AST & metadata (contract-info.json)
│           ├── contract/           # TypeScript runtime bindings (index.js, index.d.ts)
│           ├── keys/               # Prover & verifier keys for all 4 circuits
│           └── zkir/               # ZKIR & BZKIR definitions for all 4 circuits
├── docs/
│   ├── USAGE.md                    # Level 4/6: Plain-English user guide & troubleshooting
│   ├── FEEDBACK.md                 # Level 5/6: Living feedback log & improvements
│   ├── MARKETING_AND_ONBOARDING.md # Level 4/6: X launch posts, brand brief & user acquisition
│   ├── architecture.md             # Technical and cryptographic specifications
│   └── user-guide.md               # Preprod user onboarding guide
├── public/                         # Level 2: Modular Cyberpunk Lunar Web Interface
│   ├── index.html                  # Semantic, accessible HTML5 dashboard
│   ├── css/                        # Modular CSS Design System
│   │   ├── variables.css           # Design tokens, color palette, typography
│   │   ├── base.css                # Resets, ambient glow, canvas layers
│   │   ├── layout.css              # Header, brand, telemetry, navigation tabs, grid
│   │   ├── components.css          # Cards, buttons, form controls, status badges
│   │   ├── modals.css              # Circuit inspector modal, feedback modal, toasts
│   │   └── style.css               # Central stylesheet importing all CSS modules
│   └── js/                         # Modular Frontend Architecture (ES Modules)
│       ├── app.js                  # Main entry point & lifecycle coordinator
│       ├── config.js               # Centralized contract address & network endpoints
│       ├── audio.js                # Web Audio API sound synthesis engine
│       ├── lunar-scene.js          # Three.js 3D lunar sphere, dust rings & animations
│       ├── confetti.js             # Canvas particle confetti celebration engine
│       ├── wallet.js               # Midnight Lace Wallet connector & account manager
│       ├── api.js                  # Backend REST API client (status, balances, feedback)
│       ├── circuits.js             # ZK circuit callers (create, heartbeat, claim, revoke)
│       ├── feedback.js             # Community feedback loop modal & submission
│       └── ui.js                   # Tab navigation, toasts, copy helpers & modals
├── src/
│   ├── server.ts                   # Express backend connecting DApp to Midnight
│   ├── network.ts                  # Multi-network state (Devnet, Preview, Preprod, Mainnet)
│   ├── wallet.ts                   # Wallet construction & sync cache manager
│   ├── deploy.ts                   # Non-interactive multi-network deployer
│   ├── cli.ts                      # Interactive CLI to execute circuits
│   ├── check-balance.ts            # Balance inspector (tNIGHT & DUST)
│   └── setup.ts                    # One-shot environment orchestrator
├── tests/
│   └── contract.test.ts            # Automated test suite (11/11 tests passing)
├── USERS.md                        # Level 5: 50 verified Preprod wallet addresses
├── LAUNCH_USERS.md                 # Level 6: 20 verified launch addresses (70 total)
├── PROPOSAL.md                     # Level 3/4: Product Idea Proposal
├── docker-compose.yml              # Local devnet (Midnight node, indexer, proof-server)
├── package.json                    # Scripts and dependencies
└── tsconfig.json                   # TypeScript configuration
```

---

## 🏆 All-in-One Multi-Level Rubric Fulfillment

Nocturne Vault satisfies the full criteria across all six levels of the Midnight Builder Challenge:

| Level | Lunar Phase | Milestone | Nocturne Vault Implementation | Status |
|:---:|---|---|---|:---:|
| **🌑 1** | **New Moon** | Toolchain, Compact Contract, Test Suite, Managed Directory | Multi-circuit Compact contract (`nocturne-vault.compact`), 4 ZK circuits, 11/11 passing tests, generated `managed/` keys & ZKIR. **Preprod Deployed Contract**: `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`. | ✅ **Complete** |
| **🌒 2** | **Waxing Crescent** | Frontend UI & Lace Wallet Preprod Connector | **Modular Frontend Code Architecture**: Clean ES modules (`public/js/*`), Modular CSS Design System (`public/css/*`), 3D Three.js Lunar Engine, Midnight Lace Wallet connector (`window.midnight.mnLace`), and contract interaction with `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`. | ✅ **Complete** |
| **🌓 3** | **First Quarter** | Production-Grade dApp & CI/CD | GitHub Actions CI/CD (`.github/workflows/ci.yml`) automating Compact compilation, TypeScript validation, and 11/11 unit tests on push. Verified Preprod testnet contract integration. | ✅ **Complete** |
| **🌔 4** | **Waxing Gibbous** | MVP Live on Preprod & Complete Documentation | Full MVP live on Preprod ([https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app)), [`docs/USAGE.md`](docs/USAGE.md), technical specifications, and X profile campaign ([@NocturneVault](https://x.com/NocturneVault)). | ✅ **Complete** |
| **🌕 5** | **Full Moon** | Living Feedback Loop & 50 Preprod Users | In-app **Builder Feedback Modal** (`/api/feedback`), [`docs/FEEDBACK.md`](docs/FEEDBACK.md), and 50 verified Preprod user wallet addresses documented in [`USERS.md`](USERS.md). | ✅ **Complete** |
| **🌝 6** | **Supermoon** | Mainnet Deployment Configuration & Launch Assets | Mainnet network presets, Brand Brief & Launch Kit ([`docs/MARKETING_AND_ONBOARDING.md`](docs/MARKETING_AND_ONBOARDING.md)), and 20 additional launch users in [`LAUNCH_USERS.md`](LAUNCH_USERS.md) (Total: 70 Preprod users). | ✅ **Complete** |

---

## 🔗 Live GitHub Repository

👉 **[https://github.com/rudhu29/midnight-new-moon](https://github.com/rudhu29/midnight-new-moon)**
