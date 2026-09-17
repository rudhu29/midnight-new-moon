# Nocturne Vault — Marketing, Brand Brief & User Onboarding Kit

> **Builder Challenge Resources: Level 4, Level 5 & Level 6 Milestones**

---

## 1. Product X Launch Posts (Level 4 Milestone)

### Tweet 1: What It Is & Why Midnight (Value Proposition)
> What happens to your crypto, seed phrases, and multisig recovery keys if you're suddenly incapacitated? Traditional blockchains permanently leak your balances and activity if you use smart contracts.
> 
> Introducing **@NocturneVault**: the first confidential zero-knowledge dead-man's switch and inheritance locker built natively on @MidnightNtwrk.
> 
> Private by default. Verified by math. 🌙🔐 #MidnightNetwork #Web3Privacy #ZeroKnowledge

### Tweet 2: Technical Insight (Privacy Model & Compact `disclose()`)
> How does @NocturneVault attest liveness without doxxing your wallet?
> 
> In Compact, secrets and witnesses are private client-side by default. Our `heartbeat()` circuit proves authorization via zk-SNARKs with ZERO identity or balance leaks. 
> 
> The `disclose()` directive triggers ONLY after inactivity timeout, safely delivering credentials to beneficiaries. ⚡🔒 #ZK #Midnight

### Tweet 3: Call-to-Action (Preprod Demo Invitation)
> 🚀 Nocturne Vault is officially LIVE on Midnight Preprod!
> 
> 1️⃣ Connect your Midnight Lace Wallet
> 2️⃣ Lock confidential credentials in zero-knowledge
> 3️⃣ Attest liveness with 1-click ZK heartbeats
> 
> Experience true Web3 privacy today:
> 👉 https://midnight-new-moon.vercel.app
> 
> Built for the Monthly Moonshots challenge. Let us know your feedback! 🌕

---

## 2. User Acquisition Materials (Level 5 Milestone)

### a) Discord / Telegram Message (Under 100 words)
> Hey everyone! 👋 I just shipped **Nocturne Vault** on Midnight Preprod — a zero-knowledge dead-man's switch and digital asset inheritance locker. 
> 
> It lets you store confidential keys/secrets that automatically transfer to a beneficiary only if you go inactive, completely shielding your wallet and data with zk-SNARKs.
> 
> Could you test it out for 2 minutes?
> 1. Switch Lace Wallet to **Midnight Preprod**
> 2. Try the demo: https://midnight-new-moon.vercel.app
> 3. Drop your `mn_addr_preprod1...` address here so I can add you to our verified testers list! 🙏

### b) X Post (Under 280 characters)
> 🌙 Test the future of Web3 data privacy!
> 
> @NocturneVault is live on @MidnightNtwrk Preprod. Lock confidential credentials with ZK heartbeats & zero identity leaks.
> 
> Try the live dApp now:
> 👉 https://midnight-new-moon.vercel.app
> 
> Drop your Preprod address below to get verified! 👇

### c) Direct DM Template (College / Developer Contacts)
> Hey [Name]! Hope you're doing well.
> 
> I've been building a zero-knowledge dApp for the Midnight Network hackathon called **Nocturne Vault**. It’s a decentralized dead-man’s switch that lets people securely pass down recovery keys or private wills using Compact ZK smart contracts without exposing any balances or metadata on-chain.
> 
> The MVP is live on Midnight Preprod at https://midnight-new-moon.vercel.app and I’m collecting feedback from developers.
> 
> Would you be up to test the wallet connect and submit a test vault? It takes about 2 minutes with Lace Wallet. If you do, send me your Preprod address so I can feature you in our `USERS.md` tester log! Really appreciate your thoughts.

---

## 3. Brand Brief (Level 6 Milestone)

- **One-Line Tagline**: *"Start in the dark. Protect what matters. Disclose in the light."*
- **Core Value Proposition**: The premier zero-knowledge digital asset succession protocol on Midnight, decoupling liveness attestation from identity surveillance.
- **3 Key Messages**:
  1. **Zero Metadata Leaks**: Observers can never observe who your beneficiaries are, how much you hold, or when you attest to being alive.
  2. **Intentional Cryptographic Declassification**: Secrets remain strictly client-side until the audited Compact `disclose()` threshold expires.
  3. **Non-Custodial Succession**: Eliminates reliance on centralized lawyers, escrow companies, or centralized dead-man timers.
- **Suggested Color Palette**:
  - **Lunar Void (Primary Background)**: `#06070d`
  - **Deep Midnight (Surface Layer)**: `#0a0c16`
  - **Electric Cyan (ZK Accent)**: `#00f2fe`
  - **Luminescence Violet (Secondary Accent)**: `#4facfe`
  - **Midnight Amethyst (Tertiary Accent)**: `#8a2be2`
  - **Verified Emerald (Active State)**: `#00f5a0`
  - **Alert Coral (Revocation / Danger)**: `#ff3366`
- **Product X Bio (Under 160 characters)**:
  > Confidential ZK secret locker & dead-man's switch on @MidnightNtwrk. Non-custodial crypto inheritance with zero metadata leaks. Built for Moonshots. 🌙🔒
- **Product X Banner Concept**:
  - A cinematic 3D lunar crescent against a deep starfield with glowing neon cyan and purple cryptographic orbital rings. In the center, a holographic geometric vault pulses with geometric zk-SNARK constraint geometry. Text on the right: *"Nocturne Vault — Confidential State & Succession on Midnight"*.

---

## 4. User Onboarding Script (Level 6 Milestone)

1. **Step 1: Install Midnight Lace Wallet**  
   - Visit [https://www.lace.io/](https://www.lace.io/) and add the Lace extension to Chrome/Brave/Edge.
   - Open Lace, create or import your wallet, and switch the network toggle to **Midnight Preprod**.
2. **Step 2: Fund with Preprod tNIGHT**  
   - Copy your `mn_addr_preprod1...` address.
   - Visit [https://midnight-tmnight-preprod.nethermind.dev](https://midnight-tmnight-preprod.nethermind.dev), paste your address, and request free test tokens.
3. **Step 3: Test Nocturne Vault**  
   - Open [https://midnight-new-moon.vercel.app](https://midnight-new-moon.vercel.app).
   - Click **Connect Lace Wallet**.
   - Go to **Create Vault**, hit **⚡ Fill Demo Preset**, and click **Lock Confidential Secret**.
   - Navigate to **ZK Heartbeat** and click **Send Verified ZK Heartbeat** to attest your liveness.
4. **Step 4: Confirm Your Address**  
   - Reply to this message with your `mn_addr_preprod1...` address so your participation is permanently recorded in `LAUNCH_USERS.md`!

---

## 5. Demo Video Checklist

- [x] **Contract Address Display**: Show `efa5b7c7dc3b7df598665d90bf2e8c73b815a042a94dfab39d8096b946cb0d71` in the dApp header.
- [x] **Lace Wallet Connection**: Connect Midnight Lace Wallet and show the short address on screen.
- [x] **Circuit Execution**: Create a vault, show the 3-step proof generation loader, and demonstrate the green on-chain confirmation with confetti and audio chime.
- [x] **ZK Heartbeat Attestation**: Send a heartbeat, increment the verified counter, and reset the countdown.
- [x] **Selective Declassification**: Demonstrate the `claimVault` disclosure revealing the secret only when the timelock condition is met.
- [x] **Zero Knowledge Demonstration**: Emphasize that the private input was never broadcasted or logged on-chain.
