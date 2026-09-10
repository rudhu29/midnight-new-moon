# 👥 Nocturne Vault: Preprod User Onboarding & Testing Guide

> Targeted for **Level 5 — Full Moon** (Onboarding 50+ Preprod Community Users & Collecting Structured Feedback).

---

## 🛠️ Step 1: Install Midnight Lace Wallet (Preprod)

1. Open Google Chrome or Brave.
2. Install the **Midnight Lace Extension** from the [Midnight Developer Portal](https://docs.midnight.network/develop/tutorial/wallet/lace).
3. Create or restore your wallet. Ensure your network is set to **Preprod**.
4. Copy your address (format: `mn_addr_preprod1...`).

---

## 🚰 Step 2: Fund Your Wallet with Testnet tNIGHT

1. Visit the official Nethermind Preprod Faucet:  
   👉 **[https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev)**
2. Paste your `mn_addr_preprod1...` address.
3. Click **Request tNIGHT**. Your tokens will arrive in ~15–30 seconds.

---

## 🚀 Step 3: Connect & Test Nocturne Vault

1. Open Nocturne Vault at **`http://localhost:3000`** (or deployed staging URL).
2. Click **Connect Lace Wallet** in the top-right corner.
3. Notice your address and network badge updating to **Midnight Preprod**.

### Test Flows:
- **Test Case A: Deposit a Confidential Vault**
  - Navigate to **Create Vault**.
  - Enter a test confidential phrase (e.g. `midnight-secret-backup-seed-phrase`).
  - Set an inactivity threshold (e.g. `24` hours).
  - Click **Commit Secret to ZK Vault**.
  - Observe the zero-knowledge proof generation and transaction confirmation!
- **Test Case B: Send a ZK Heartbeat**
  - Navigate to **ZK Heartbeat**.
  - Click **Send ZK Heartbeat Now**.
  - Notice the verified heartbeats counter incrementing on-chain!
- **Test Case C: Emergency Unlock & Claim**
  - Navigate to **Claim / Revoke**.
  - Click **Execute Emergency Claim** to trigger the disclosure circuit and reveal the secret payload.

---

## 💬 Step 4: Share Your Feedback (In-App Feedback Loop)

1. Click the **Community Feedback** tab.
2. Click **Submit Feedback**.
3. Rate your user experience (1–5 stars), choose your category (UX, Privacy, Feature, or Bug), and type your suggestions.
4. Click **Submit Feedback** — your review is recorded and visible to the development team immediately!
