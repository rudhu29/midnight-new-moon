# 🌙 Nocturne Vault: Confidential Secret & Dead-Man's Switch on Midnight

[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20%2F%20Mainnet-7f00ff?style=for-the-badge&logo=moon)](https://midnight.network)
[![Compact Compiler](https://img.shields.io/badge/Compact-0.5.1-00f2fe?style=for-the-badge)](https://midnight.network)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated%20Pipeline-00ff87?style=for-the-badge&logo=githubactions)](https://github.com/rudhu29/midnight-new-moon/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-4facfe?style=for-the-badge)](LICENSE)

> Built for the **Monthly Moonshots on Midnight** Builder Journey  
> **"Start in the dark. Ship in the light."**

---

## 📜 Deployed Smart Contract (Midnight Preprod Testnet)

> [!IMPORTANT]
> **Verified Midnight Preprod Deployment**: The multi-circuit `nocturne-vault` smart contract is live and deployed on Midnight Preprod Testnet.

| Parameter | Value / Link | Description |
|---|---|---|
| **Contract Address** | `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71` | Hex identifier of the deployed Nocturne Vault contract on Midnight |
| **Network** | **Midnight Preprod Testnet** (`preprod`) | Official Midnight Testnet environment |
| **Deployer Wallet** | `mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke` | Midnight Preprod Bech32m wallet address |
| **Deployed At** | `2026-09-10T14:15:00.000Z` | Genesis deployment timestamp |
| **Compact Source** | [`contracts/nocturne-vault.compact`](file:///contracts/nocturne-vault.compact) | 4 zero-knowledge circuits (`createVault`, `heartbeat`, `claimVault`, `revokeVault`) |
| **Live Demo dApp** | [https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app) | Production dApp with Midnight Lace Wallet & 3D Lunar Engine |
| **Preprod Faucet** | [https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev) | Nethermind Preprod tNIGHT & DUST faucet |

---

## 💡 Executive Summary & Problem Statement

In Web3, billions of dollars in digital assets, seed phrases, private keys, legal documents, and emergency credentials are permanently lost if a holder becomes incapacitated or passes away. Existing blockchain inheritance solutions suffer from a fatal flaw: **transparent ledgers leak privacy**. Observers can see vault balances, deposit intervals, owner-beneficiary relationships, and liveness activity.

**Nocturne Vault** solves this through Midnight's native zero-knowledge dual-state architecture. Using Compact smart contracts:
- **Private by Default**: Secret payloads, beneficiary keys, and authorization witnesses remain strictly on the client machine.
- **ZK Liveness Attestation**: The vault owner submits periodic **ZK Heartbeats** proving they are alive without revealing their account balance or identity.
- **Selective Declassification**: The Compact `disclose()` directive is invoked intentionally only if the inactivity threshold passes, allowing the designated beneficiary to unlock the secret.

---

## 🏆 All-in-One Multi-Level Rubric Fulfillment

Nocturne Vault is architected to satisfy the criteria for all levels of the Midnight Builder Challenge:

| Level | Lunar Phase | Milestone | Nocturne Vault Implementation |
|:---:|---|---|---|
| **🌑 1** | **New Moon** | Toolchain, Compact Contract, Test Suite, Managed Directory | Multi-circuit Compact contract (`nocturne-vault.compact`), 4 ZK circuits, 11/11 passing tests, generated `managed/` keys & ZKIR. **Preprod Deployed Contract**: `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`. |
| **🌒 2** | **Waxing Crescent** | Frontend UI & Lace Wallet Preprod Connector | **Modular Frontend Code Architecture**: Clean ES modules (`public/js/*`), Modular CSS Design System (`public/css/*`), 3D Three.js Lunar Engine, Midnight Lace Wallet connector (`window.midnight.mnLace`), and contract interaction with `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`. |
| **🌓 3** | **First Quarter** | Production-Grade dApp & CI/CD | GitHub Actions CI/CD (`.github/workflows/ci.yml`) automating Compact compilation, TypeScript validation, and 11/11 unit tests on push. Verified Preprod testnet contract integration. |
| **🌔 4** | **Waxing Gibbous** | MVP Live on Preprod & Complete Documentation | Full MVP live on Preprod, architectural specifications (`docs/architecture.md`), and API documentation. |
| **🌕 5** | **Full Moon** | Living Feedback Loop & 50 Preprod Users | In-app **Builder Feedback Modal** (`/api/feedback`) with ratings/bug reports and 50-user onboarding guide (`docs/user-guide.md`). |
| **🌝 6** | **Supermoon** | Mainnet Deployment Configuration & Launch Assets | Mainnet network preset in `src/network.ts`, production brand kit, and Mainnet rollout guide. |

---

## 🔒 Architectural Deep Dive: Public State vs. Private Witness

In Compact, privacy is guaranteed by default rather than treated as an afterthought:

```mermaid
graph LR
    subgraph "Private Domain (Client-Side)"
        A["Private Secret Payload<br/>(Seed / Key / Will)"] --> B["Compact Circuit<br/>(nocturne-vault.compact)"]
        W["Owner Witness<br/>(secretKeyWitness)"] --> B
        B --> C["Proof Server<br/>(Client-Side ZK Prover)"]
        B --> D["disclose()<br/>Selective Declassification"]
    end
    subgraph "Public Domain (Midnight Consensus)"
        D --> E["Public Ledger State<br/>(vaultActive, heartbeats, payload)"]
        C --> F["Consensus Validators<br/>(Verifier Keys *.verifier)"]
    end
```

### 1. Private by Default
In Compact, all circuit arguments, local variables, and witness functions are **private by default**. They reside strictly in local client memory and never leave the user's device unencrypted. The network nodes, miners, and indexers never see these values.

### 2. The Purpose of `disclose()`
Calling `disclose(value)` does **not** automatically broadcast data across the network. Instead, `disclose()` is an intentional developer directive to the Compact compiler:
- It confirms that the developer has evaluated the private witness value and explicitly permits it to transition across the privacy boundary into public state.
- Without `disclose()`, attempting to assign private variables to public ledger fields halts with a compilation error.

### 3. Client-Side ZK Proof Generation
Instead of nodes re-executing private logic, the client runs the circuit locally against proving keys (`.prover`) via Midnight's proof server. Only the generated zero-knowledge proof and the disclosed public state transitions are submitted in the transaction. Validators confirm transaction validity using the lightweight verifier key (`.verifier`) without ever observing the private witness inputs.

---

## ⚡ Nocturne Vault Compact Circuits

The contract implements four zero-knowledge circuits:

1. **`createVault(ownerCommitment, initialSecret)`**: Locks a confidential secret with an owner ZK commitment and sets the initial state.
2. **`heartbeat()`**: Owner proves liveness in zero-knowledge, incrementing the verified on-chain counter and resetting the countdown.
3. **`claimVault(revealedSecret)`**: Designated beneficiary claims and decrypts the secret after inactivity expiration.
4. **`revokeVault(revocationNotice)`**: Owner securely terminates and purges the vault before expiration.

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
│   ├── architecture.md             # Level 4: Technical and cryptographic specifications
│   └── user-guide.md               # Level 5: 50 Preprod user onboarding & feedback guide
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
├── docker-compose.yml              # Local devnet (Midnight node, indexer, proof-server)
├── package.json                    # Scripts and dependencies
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: >= 22.0.0 (Tested on Node 24.18.0)
- **Compact Compiler**: v0.5.1
- **Docker & Compose**: v2+
- **WSL2 (Ubuntu)**: For Windows environments

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Automated Test Suite (11/11 Pass)
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
  ✓ Compiled Nocturne Vault TypeScript runtime bindings are importable (48ms)

--- Network, Wallet & Multi-Phase Infrastructure ---
  ✓ Supported network configurations support Devnet, Preview, Preprod, and Mainnet (0ms)
  ✓ Active network resolution succeeds and falls back gracefully (1ms)
  ✓ Unshielded native token helper returns valid token descriptor (1ms)

--- Confidential State & Vault Semantics ---
  ✓ Vault payload serialization maintains byte integrity under disclose (0ms)
  ✓ Commitment hash derivation produces valid 32-byte representation (0ms)

------------------------------------------------------
Test Results: 11/11 passed (0 failed)
------------------------------------------------------
🎉 All Nocturne Vault tests passed successfully!
```

### 3. Compile Compact Contracts
```bash
npm run compile
```

### 4. Midnight Preprod Testnet Deployed Contract

The Nocturne Vault multi-circuit confidential contract is pre-deployed and active on the Midnight Preprod Testnet:
- **Contract Address**: `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`
- **Deployer Wallet Address**: `mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke`
- **Network**: `Midnight Preprod Testnet` (`preprod`)
- **Deployed Timestamp**: `2026-09-10T14:15:00.000Z`
- **Preprod Faucet URL**: [https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev)
- **Live Demo dApp**: [https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app)

To redeploy or deploy a new instance to Midnight Preprod:
```bash
npm run setup -- --network preprod
```

### 5. Launch the Web UI
```bash
npx tsx src/server.ts
```
Open **[http://localhost:3000](http://localhost:3000)** to experience Nocturne Vault:
- Connect Midnight Lace Wallet (`window.midnight.mnLace`)
- Verify on-chain Preprod Contract (`efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`)
- Deposit a confidential vault with owner commitment witness
- Submit ZK Heartbeats proving liveness without identity leak
- Execute emergency claim or revocation via Compact `disclose()`
- Submit community tester feedback

---

## 🔍 On-Chain Contract Verification & Inspection

Reviewers and developers can verify the deployed contract state and ZK circuits using three methods:

### Method 1: Web dApp Live State & Circuit Inspector
1. Visit **[https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app)** or local `http://localhost:3000`.
2. Notice the header badge displaying the verified **Preprod Contract Address**:  
   `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71` (click to copy).
3. Click **"Inspect Compact Circuits"** to view live cryptographic metrics for all 4 circuits (`createVault`, `heartbeat`, `claimVault`, `revokeVault`), verifying prover key sizes, verifier key hashes, and ZKIR integrity.

### Method 2: REST API Query
Query the active deployment and network telemetry directly:
```bash
curl https://midnight-new-moon.vercel.app/api/status
```
Response:
```json
{
  "network": "preprod",
  "contractAddress": "efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71",
  "walletAddress": "mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke",
  "deployedAt": "2026-09-10T14:15:00.000Z",
  "deployer": "mn_addr_preprod1rjywwgs5zza2uwmsv2pr7qu3c9xgp9f95mq80fw3c35fxg8d0m4qvm7fke"
}
```

### Method 3: CLI Contract Inspector
```bash
# Inspect on-chain tNIGHT and DUST balances
npm run check-balance

# Launch interactive Midnight contract CLI
npm run cli
```

---

## 🔗 Live GitHub Repository

👉 **[https://github.com/rudhu29/midnight-new-moon](https://github.com/rudhu29/midnight-new-moon)**
