import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const AuthContext = createContext(null);

const DEMO_WALLET = "0x71C8A9b7f523D4e19F421bA4A16dC955047b392A";
const DOMAIN = "kitaab-bazaar.edu";
const URI = "https://kitaab-bazaar.edu/login";

// Generate random cryptographic hex nonce
export function generateNonce() {
  const bytes = new Uint8Array(8);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function buildSiweMessage({
  domain = DOMAIN,
  address = DEMO_WALLET,
  statement = "Sign in to Kitaab Bazaar to manage your college engineering textbook listings and escrow payouts.",
  uri = URI,
  version = "1",
  chainId = 1,
  nonce,
  issuedAt,
  expirationTime,
}) {
  const now = new Date();
  const exp = new Date(now.getTime() + 10 * 60 * 1000); // 10 min TTL

  const iAt = issuedAt || now.toISOString();
  const eAt = expirationTime || exp.toISOString();
  const n = nonce || generateNonce();

  const message = `${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${uri}
Version: ${version}
Chain ID: ${chainId}
Nonce: ${n}
Issued At: ${iAt}
Expiration Time: ${eAt}
Resources:
- urn:auth:access:seller
- urn:escrow:payouts:mainnet`;

  return {
    rawMessage: message,
    fields: {
      domain,
      address,
      statement,
      uri,
      version,
      chainId,
      nonce: n,
      issuedAt: iAt,
      expirationTime: eAt,
    }
  };
}

export function AuthProvider({ children }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(DEMO_WALLET);
  const [walletType, setWalletType] = useState('MetaMask'); // 'MetaMask' | 'Rabby' | 'Coinbase' | 'Safe' | 'Biconomy' | 'Argent' | 'Injected'
  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false);
  const [chainId, setChainId] = useState(1);
  
  // SIWE state
  const [siwePayload, setSiwePayload] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Session TTL
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(42 * 60); // 42 mins default
  
  // Security Simulation States
  const [isForbidden403, setIsForbidden403] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Initialize SIWE Challenge
  const initializeChallenge = useCallback((address = walletAddress, chain = chainId) => {
    const payload = buildSiweMessage({ address, chainId: chain });
    setSiwePayload(payload);
    return payload;
  }, [walletAddress, chainId]);

  // Connect Wallet
  const connectWallet = async (type = 'MetaMask', customAddress = null) => {
    try {
      if (type === 'Injected' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        const addr = accounts[0];
        setWalletAddress(addr);
        setChainId(Number(network.chainId));
        setWalletType('Injected');
        setIsSmartContractWallet(false);
        setWalletConnected(true);
        initializeChallenge(addr, Number(network.chainId));
        return { success: true, address: addr, chainId: Number(network.chainId) };
      }

      // Simulated wallets
      const isSC = ['Safe', 'Biconomy', 'Argent'].includes(type);
      const addr = customAddress || DEMO_WALLET;
      setWalletAddress(addr);
      setWalletType(type);
      setIsSmartContractWallet(isSC);
      setChainId(1);
      setWalletConnected(true);
      initializeChallenge(addr, 1);
      return { success: true, address: addr, chainId: 1 };
    } catch (err) {
      console.error("Wallet connection error:", err);
      return { success: false, error: err.message };
    }
  };

  // Sign SIWE Message
  const signSiweMessage = async (overrideMessage = null) => {
    const payloadToSign = overrideMessage || siwePayload;
    if (!payloadToSign) {
      throw new Error("No active SIWE challenge to sign.");
    }

    // If real injected wallet
    if (walletType === 'Injected' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sig = await signer.signMessage(payloadToSign.rawMessage);
      setSignature(sig);
      return sig;
    }

    // Deterministic simulation or random valid ECDSA signature
    const mockWallet = ethers.Wallet.createRandom();
    const sig = await mockWallet.signMessage(payloadToSign.rawMessage);
    setSignature(sig);
    return sig;
  };

  // Complete SIWE Session
  const completeAuthentication = (sig) => {
    const token = `kb_jwt_${generateNonce()}_${Date.now()}`;
    const expiry = Date.now() + 45 * 60 * 1000; // 45 minutes
    setSignature(sig);
    setSessionToken(token);
    setIsAuthenticated(true);
    setSessionExpiry(expiry);
    setSecondsRemaining(45 * 60);
    setIsForbidden403(false);
    setIsSessionExpired(false);
  };

  // Disconnect / Revoke Token
  const revokeSession = () => {
    setSessionToken(null);
    setIsAuthenticated(false);
    setSignature(null);
    setSecondsRemaining(0);
  };

  const disconnectWallet = () => {
    revokeSession();
    setWalletConnected(false);
    setSiwePayload(null);
  };

  // Session TTL Tick
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsSessionExpired(true);
          setIsAuthenticated(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  // Format countdown string
  const formatTtl = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s remaining`;
  };

  return (
    <AuthContext.Provider
      value={{
        walletConnected,
        walletAddress,
        setWalletAddress,
        walletType,
        isSmartContractWallet,
        chainId,
        setChainId,
        siwePayload,
        signature,
        sessionToken,
        isAuthenticated,
        secondsRemaining,
        formatTtl,
        isForbidden403,
        setIsForbidden403,
        isSessionExpired,
        setIsSessionExpired,
        connectWallet,
        disconnectWallet,
        initializeChallenge,
        signSiweMessage,
        completeAuthentication,
        revokeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
