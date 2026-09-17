# How to Use Nocturne Vault

> **Confidential Secret Locker & Dead-Man's Switch on Midnight Preprod**  
> *Non-technical, user-friendly guide for onboarding and interacting with zero-knowledge circuits.*

---

## 1. What You Need

Before creating or claiming a confidential vault on Midnight Preprod, ensure you have:
1. **Midnight Lace Wallet Extension**: Installed in your Chromium browser (Chrome, Brave, Edge).  
   👉 Download from [https://www.lace.io/](https://www.lace.io/)
2. **Preprod Network Selected**: In your Lace Wallet settings, toggle the active network to **Midnight Preprod**.
3. **Preprod Test Tokens (tNIGHT & DUST)**:
   - Request free test tokens from the official faucet:  
     👉 [https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev)
   - Enter your `mn_addr_preprod1...` address and receive tNIGHT within 60 seconds.
4. **Web Browser**: Any modern browser with WebGL & Web Audio support (Chrome, Brave, Edge, Firefox).

---

## 2. Getting Started on Preprod

1. Navigate to the live dApp:  
   👉 **[https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app)**  
   *(or run locally at `http://localhost:3000` via `npm run dev`)*
2. In the top navigation header, verify the network status chip displays **Preprod Testnet** with a pulsing green indicator.
3. Check that the verified contract address displays:  
   `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`.
4. Click **Connect Lace Wallet** in the top-right header and approve the connection request in the Lace pop-up.
5. Your short wallet address will appear on the button, confirming you are authenticated.

---

## 3. Step-by-Step Guide

### Step 3.1: Creating a Confidential Vault (`createVault`)
1. Click the **Create Vault** tab in the main navigation.
2. **Confidential Secret Payload**: Enter the sensitive data you wish to protect (e.g., recovery seed phrase, private keys, emergency instructions, or confidential credentials).
3. **Beneficiary Midnight Address**: Enter the designated beneficiary's Midnight Bech32m address (`mn_addr_preprod1...`).
4. **Inactivity Expiration Threshold**: Specify the duration (e.g., `48` or `72` hours) before the secret can be unlocked by the beneficiary.
5. *(Optional)* Click **⚡ Fill Demo Preset** to prefill sample credentials for rapid testing.
6. Click **Lock Confidential Secret (ZK Prove)**.
7. **What Happens Behind the Scenes**:
   - **Step 1/3**: Your browser derives a 32-byte SHA-256 commitment from your secret and private key witness.
   - **Step 2/3**: The client generates a zk-SNARK proof locally. The raw secret NEVER leaves your machine.
   - **Step 3/3**: The transaction proof and public commitment are submitted to Midnight consensus.
8. Upon confirmation, a green confetti burst and resonant success chime will signal that your vault is active on-chain!

### Step 3.2: Attesting Liveness (`heartbeat`)
1. While your vault is active, you must submit periodic liveness attestations to prevent premature disclosure.
2. Navigate to the **ZK Heartbeat** tab.
3. Observe the dynamic 3D radar pulse visualizer and your verified heartbeat counter.
4. Click **Send Verified ZK Heartbeat**.
5. **What Happens**:
   - The contract verifies your owner authorization witness in zero knowledge.
   - The on-chain `heartbeats` counter increments by 1.
   - The inactivity countdown timer resets to the full duration threshold.
   - An on-chain observer sees that a valid heartbeat was logged, but cannot deduce your identity, balance, or vault contents.

### Step 3.3: Emergency Disclosure & Claiming (`claimVault`)
1. If the inactivity threshold expires without a heartbeat attestation, the designated beneficiary can unlock the secret.
2. Click the **Claim / Revoke** tab.
3. Click **Claim Vault Secret (Execute disclose)**.
4. **What Happens**:
   - The Compact circuit verifies that the vault is active and the timelock expiration condition has been satisfied.
   - The intentional `disclose(secret)` primitive transitions the private payload into public readable state.
   - The secret is revealed securely on screen in the green disclosure container.

### Step 3.4: Manual Revocation & State Purge (`revokeVault`)
1. If you wish to terminate the vault before expiration, click the **Claim / Revoke** tab as the vault owner.
2. Click **Revoke & Purge Vault**.
3. Confirm the confirmation prompt.
4. **What Happens**:
   - The circuit sets `vaultActive = false` and purges the payload from active state machine memory.

---

## 4. Your First Transaction

Here is a 2-minute walkthrough to verify your first transaction end-to-end:
1. Connect Lace Wallet on Preprod.
2. Go to **Create Vault**, click **⚡ Fill Demo Preset**, and click **Lock Confidential Secret**.
3. Once confirmed, copy the transaction hash from the **Transaction Receipt** banner.
4. Click the **Overview** tab to see your active commitment (`0x9f8e7d...`) and 1 verified heartbeat.
5. Go to **ZK Heartbeat** and click **Send Verified ZK Heartbeat** to increment the counter to 2.
6. Leave your tester feedback in the **Feedback** tab to record your rating on Preprod!

---

## 5. What Gets Proved (and What Stays Private)

| Data Component | Visibility | Where It Lives | Cryptographic Handling |
|---|---|---|---|
| **Secret Payload** | **PRIVATE** | Client device only | Kept in client memory; only disclosed upon valid timelock claim. |
| **Owner Private Key Witness** | **PRIVATE** | Local Lace Wallet | Never broadcasted; verified via zero-knowledge proving keys. |
| **Vault Commitment** | **PUBLIC** | Midnight Ledger | 32-byte cryptographic hash of secret + salt. |
| **Inactivity Counter** | **PUBLIC** | Midnight Ledger | Monotonically incrementing integer counter proving liveness. |
| **Active Status** | **PUBLIC** | Midnight Ledger | Boolean flag (`true` while active, `false` upon claim/revoke). |

---

## 6. Troubleshooting & FAQ

### Q: Lace Wallet displays "Extension not detected"?
- **Fix**: Ensure the Midnight Lace Wallet extension is installed and enabled in your browser extensions manager. Reload the page and make sure pop-ups are permitted.

### Q: Transaction fails with "Insufficient funds"?
- **Fix**: Check your tNIGHT and DUST balances on the Overview tab. Request free test tokens from the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev).

### Q: Heartbeat says "Vault is not active"?
- **Fix**: You must first create a vault in the **Create Vault** tab before submitting heartbeats.

### Q: How do I verify the contract on-chain?
- **Fix**: The contract address is `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71`. You can query `/api/status` or run `npm run check-balance` in the terminal.
