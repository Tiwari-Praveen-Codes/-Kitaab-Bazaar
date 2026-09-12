# Kitaab Bazaar — Sign In With a Wallet (SIWE & Escrow)
 live on :- https://kitabbazar-tawny.vercel.app/

Kitaab Bazaar is a decentralized second-hand engineering textbook marketplace used by students across approximately 40 colleges.

This project implements **Sign In With Ethereum (SIWE)** authentication so sellers can log in using their wallet instead of passwords or SMS OTPs.

The core security principle is:

> **A connected wallet is not an authenticated user.**

Authentication is granted only after the backend verifies the signed EIP-4361 message and establishes a server-side session.

---

## 🚀 Key Features

- **Wallet-based Login with SIWE**: One-click connection with MetaMask, Rabby, Coinbase Wallet, Injected providers, or Smart Contract Wallets (Safe, Biconomy, Argent).
- **EIP-4361 Compliant Authentication Messages**: Complete standard-compliant challenge generation and inspection.
- **Cryptographic Nonce & Replay Protection**: Verified single-use entropy nonces.
- **Domain & Chain ID Validation**: Origin guard preventing phishing and network mismatches.
- **SIWE Validity-Window Enforcement**: Strict 10-minute validity and 45-minute session countdown.
- **Dual Signature Verification**: EOA ECDSA `ecrecover` & ERC-1271 smart-account `isValidSignature` verification.
- **Seller Vault & Payout Dashboard**: Manage engineering textbook inventory, campus departments, and escrow balances in INR (₹) & ETH.
- **Anti-Cheat Physical Handshake Escrow**: Multi-party 2-factor physical exchange verification with automated seller payout release.
- **Error Matrix & Security Audit Suite**: Interactive live diagnostics across 8 consensus and client error vectors.

---

## 🔐 Authentication & Escrow Flow

```text
┌──────────────────┐
│     Browser      │
└────────┬─────────┘
         │
         │ Connect wallet
         ▼
┌──────────────────┐
│  GET /api/auth/  │
│      nonce       │
└────────┬─────────┘
         │
         │ Server-generated nonce
         ▼
┌──────────────────┐
│ Build EIP-4361   │
│  SIWE message    │
└────────┬─────────┘
         │
         │ User signs message
         ▼
┌──────────────────┐
│ POST /api/auth/  │
│      verify      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│             Backend              │
│                                  │
│ Nonce validation                 │
│ Domain validation                │
│ Chain ID validation              │
│ issuedAt validation              │
│ expiration validation            │
│                                  │
│ EOA ────────► ECDSA verification │
│ Contract ───► ERC-1271           │
└───────────────┬──────────────────┘
                │
                │ Verified wallet address
                ▼
       ┌──────────────────┐
       │ Server Session   │
       │ walletAddress    │
       └────────┬─────────┘
                │
                ▼
       ┌──────────────────┐
       │ Seller Dashboard │
       │                  │
       │ session address  │
       │       ↓          │
       │ seller records   │
       └──────────────────┘
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Web3 & Cryptography**: ethers.js v6 (EIP-4361, EIP-1271, ECDSA)
- **Icons & UI**: Lucide React, Google Material Symbols, Canvas Confetti

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
