# Kitaab Bazaar — Sign In With a Wallet

Kitaab Bazaar is a second-hand engineering textbook marketplace used by students across approximately 40 colleges.

This project implements **Sign In With Ethereum (SIWE)** authentication so sellers can log in using their wallet instead of passwords or SMS OTPs.

The core security principle is:

> **A connected wallet is not an authenticated user.**

Authentication is granted only after the backend verifies the signed EIP-4361 message and establishes a server-side session.

---

## Features

- Wallet-based login with SIWE
- EIP-4361 compliant authentication messages
- Server-generated cryptographic nonces
- One-time nonce / replay protection
- Server-side domain validation
- Server-side chain ID validation
- SIWE validity-window enforcement
- EOA signature verification
- ERC-1271 smart-account signature verification
- Secure HTTP-only sessions
- Seller-only dashboard
- Server-side seller authorization
- PostgreSQL + Prisma
- TypeScript
- Automated security tests

---

## Authentication Flow

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
