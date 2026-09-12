import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';

export default function SiweSigningScreen({ onNavigate }) {
  const {
    walletConnected,
    walletAddress,
    walletType,
    isSmartContractWallet,
    siwePayload,
    initializeChallenge,
    signSiweMessage,
    completeAuthentication,
    isAuthenticated,
  } = useAuth();

  const { showToast } = useMarketplace();

  const [activeTab, setActiveTab] = useState('sign'); // 'sign' | 'verify'
  const [isSigning, setIsSigning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(25);
  const [stepStates, setStepStates] = useState({
    format: 'pending',
    nonce: 'pending',
    domain: 'pending',
    ecrecover: 'pending',
  });
  const [copied, setCopied] = useState(false);

  // Ensure SIWE payload is ready
  useEffect(() => {
    if (!siwePayload) {
      initializeChallenge(walletAddress);
    }
  }, [siwePayload, walletAddress, initializeChallenge]);

  // Handle Copy Raw SIWE Message
  const handleCopy = () => {
    if (!siwePayload) return;
    navigator.clipboard.writeText(siwePayload.rawMessage);
    setCopied(true);
    showToast("SIWE EIP-4361 raw message copied to clipboard!", "info");
    setTimeout(() => setCopied(false), 2500);
  };

  // Run the full verification flow
  const runVerificationPipeline = async () => {
    setIsVerifying(true);
    setActiveTab('verify');
    setVerificationProgress(10);
    setStepStates({ format: 'running', nonce: 'pending', domain: 'pending', ecrecover: 'pending' });

    // Step 1: Format & EIP-4361 parsing
    await new Promise(r => setTimeout(r, 600));
    setStepStates(prev => ({ ...prev, format: 'valid' }));
    setVerificationProgress(35);

    // Step 2: Nonce validation
    await new Promise(r => setTimeout(r, 700));
    setStepStates(prev => ({ ...prev, nonce: 'valid' }));
    setVerificationProgress(65);

    // Step 3: Domain & Chain ID
    await new Promise(r => setTimeout(r, 600));
    setStepStates(prev => ({ ...prev, domain: 'valid' }));
    setVerificationProgress(85);

    // Step 4: Public Key Ecrecover / EIP-1271
    await new Promise(r => setTimeout(r, 800));
    setStepStates(prev => ({ ...prev, ecrecover: 'valid' }));
    setVerificationProgress(100);
    setIsVerifying(false);

    // Complete authentication and issue session token
    completeAuthentication("0x9c4f...simulated_signature_hash");
    showToast("Cryptographic signature verified! Seller session activated.", "success");
  };

  // Trigger Signature from user
  const handleSign = async () => {
    setIsSigning(true);
    try {
      const sig = await signSiweMessage();
      showToast("Message signed successfully. Running verification checks...", "info");
      await runVerificationPipeline();
    } catch (err) {
      showToast(`Signing failed: ${err.message}`, "error");
    } finally {
      setIsSigning(false);
    }
  };

  const payloadFields = siwePayload?.fields || {
    domain: "kitaab-bazaar.edu",
    address: walletAddress,
    statement: "Sign in to Kitaab Bazaar to manage your college engineering textbook listings and escrow payouts.",
    uri: "https://kitaab-bazaar.edu/login",
    version: "1",
    chainId: 1,
    nonce: "8f9b2a1c7d4e5f60",
    issuedAt: "2025-02-24T18:32:10.000Z",
    expirationTime: "2025-02-24T18:42:10.000Z",
  };

  // Ring stroke calculation: circumference for r=42 is 2 * PI * 42 ~= 263.89
  const circumference = 264;
  const strokeDashoffset = circumference - (circumference * verificationProgress) / 100;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-lg mx-auto">
        <div className="w-full flex flex-col gap-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-bold text-on-surface leading-tight">
                  Kitaab Bazaar
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant">
                  Archival Ledger • SIWE Authenticator
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full border border-surface-container-highest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-mono text-xs text-on-surface font-semibold">Mainnet: 1</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-surface-container p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('sign')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center font-sans text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                activeTab === 'sign'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              <span>1. EIP-4361 Prompt</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verify')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center font-sans text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                activeTab === 'verify'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>2. Cryptographic Validation</span>
            </button>
          </div>

          {/* CARD 1: SIGNING CARD */}
          {activeTab === 'sign' && (
            <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-on-surface">Sign to continue</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-mono text-[10px] text-on-surface-variant font-bold">
                    EIP-4361
                  </span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant">
                  Confirm your identity for <span className="font-bold text-primary">kitaab-bazaar.edu</span>
                </p>
              </div>

              {/* Wallet Info Pill */}
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest">
                    <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-surface-container-low"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-on-surface">
                      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '0x71C8...392A'}
                    </span>
                    <span className="font-sans text-[11px] text-on-surface-variant">
                      Ethereum Mainnet ({walletType})
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest font-mono text-[10px] text-on-surface-variant font-bold">
                  {isSmartContractWallet ? 'ERC-1271' : 'EOA'}
                </span>
              </div>

              {/* Zero Gas Guarantee */}
              <div className="flex items-start gap-2.5 p-3 bg-surface-container-highest/60 rounded-xl border border-surface-container-high">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">shield</span>
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-xs text-on-surface font-bold">Zero Gas • No Balance Transfer</span>
                  <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                    Nothing will be spent or transferred. This signature is strictly used to prove cryptographic ownership of your identity.
                  </p>
                </div>
              </div>

              {/* Payload Specs Box */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    Payload Specs
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 font-sans text-xs text-primary hover:text-primary-container font-bold"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copied' : 'Copy Raw'}</span>
                  </button>
                </div>

                <div className="bg-surface-container-low border border-surface-container-high p-3 rounded-xl flex flex-col gap-1.5 font-mono text-[11px] text-on-surface select-all leading-relaxed overflow-x-auto">
                  <div>
                    <span className="text-on-surface-variant">domain:</span>{' '}
                    <span className="text-primary font-bold">{payloadFields.domain}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant">address:</span>{' '}
                    <span className="text-on-surface break-all">{payloadFields.address}</span>
                  </div>
                  <div className="py-1 px-2 rounded-lg bg-surface-container text-on-surface-variant italic font-sans text-xs">
                    "{payloadFields.statement}"
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 border-t border-surface-container">
                    <div><span className="text-on-surface-variant">uri:</span> <span className="text-on-surface">{payloadFields.uri}</span></div>
                    <div><span className="text-on-surface-variant">version:</span> <span className="text-on-surface">{payloadFields.version}</span></div>
                    <div><span className="text-on-surface-variant">chain-id:</span> <span className="text-on-surface">{payloadFields.chainId}</span></div>
                    <div><span className="text-on-surface-variant">nonce:</span> <span className="text-primary font-bold">{payloadFields.nonce}</span></div>
                  </div>
                  <div className="pt-1 text-[10px] text-on-surface-variant flex flex-col gap-0.5 border-t border-surface-container">
                    <div>issued-at: <span className="text-on-surface">{payloadFields.issuedAt}</span></div>
                    <div>expiration-time: <span className="text-on-surface">{payloadFields.expirationTime}</span></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={isSigning}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  <span>{isSigning ? 'Requesting Wallet Signature...' : 'Sign Message (EIP-4361)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('screen1')}
                  className="w-full py-2 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl font-sans text-xs font-semibold transition-colors"
                >
                  Back to Wallet Selection
                </button>
              </div>
            </div>
          )}

          {/* CARD 2: VERIFICATION CARD */}
          {activeTab === 'verify' && (
            <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300">
              <div className="absolute -top-12 -left-12 w-36 h-36 bg-tertiary-fixed-dim/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-on-surface">Verifying signature</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-sans text-xs font-bold flex items-center gap-1.5 ${
                      verificationProgress === 100
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        verificationProgress === 100 ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'
                      }`}
                    ></span>
                    <span>{verificationProgress === 100 ? 'Verified 100%' : 'In-Flight'}</span>
                  </span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant">
                  Performing stateless EIP-4361 zero-knowledge validation on relay nodes.
                </p>
              </div>

              {/* Animated Progress Gauge */}
              <div className="flex items-center justify-center py-4">
                <div className="relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-container"
                      cx="50"
                      cy="50"
                      fill="none"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                    ></circle>
                    <circle
                      className="text-primary transition-all duration-700 ease-out"
                      cx="50"
                      cy="50"
                      fill="none"
                      r="42"
                      stroke="currentColor"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      strokeWidth="6"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-extrabold text-on-surface">
                      {verificationProgress}%
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant">
                      {isSmartContractWallet ? 'EIP-1271' : 'ECDSA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step by Step Checklist */}
              <div className="flex flex-col gap-1.5 bg-surface-container-low border border-surface-container-high p-3 rounded-xl">
                {/* Step 1 */}
                <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-surface-container-lowest/90 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span className="font-sans text-xs text-on-surface font-medium">Message Structure & EIP-4361 format</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">Valid</span>
                </div>

                {/* Step 2 */}
                <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-surface-container-lowest/90 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span className="font-sans text-xs text-on-surface font-medium">Single-use server nonce matching</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">Verified</span>
                </div>

                {/* Step 3 */}
                <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-surface-container-lowest/90 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span className="font-sans text-xs text-on-surface font-medium">Domain & Chain ID integrity</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold">Pinned</span>
                </div>

                {/* Step 4 */}
                <div className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors duration-300 ${
                  stepStates.ecrecover === 'valid' ? 'bg-surface-container-lowest/90' : 'bg-surface-container-high'
                }`}>
                  <div className="flex items-center gap-2">
                    {stepStates.ecrecover === 'valid' ? (
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-primary text-[18px] animate-spin">sync</span>
                    )}
                    <span className="font-sans text-xs text-on-surface font-medium">Recovering public key from signature</span>
                  </div>
                  <span className={`font-mono text-[10px] font-bold ${
                    stepStates.ecrecover === 'valid' ? 'text-emerald-700' : 'text-primary'
                  }`}>
                    {stepStates.ecrecover === 'valid' ? 'Ecrecover OK' : 'Verifying...'}
                  </span>
                </div>
              </div>

              {/* Explainer notice */}
              <div className="p-3 rounded-xl bg-surface-container-highest/50 flex items-start gap-2 border border-surface-container-high">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 mt-0.5">info</span>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  We verify signature integrity, replay nonce, domain pinning, and message validity on our backend. Wallet address alone never grants access.
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 pt-1">
                {verificationProgress === 100 ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('screen4')}
                    className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-base">dashboard</span>
                    <span>Enter Seller Dashboard</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={runVerificationPipeline}
                    disabled={isVerifying}
                    className="flex-1 py-2.5 px-4 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Re-run Checks</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('sign')}
                  className="py-2.5 px-4 text-on-surface-variant hover:text-on-surface rounded-xl font-sans text-xs font-semibold"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Footer Audits link */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span className="font-mono text-[10px]">Open Source Escrow v2.4</span>
            </div>
            <button
              onClick={() => onNavigate('screen5')}
              className="font-mono text-[10px] text-primary hover:underline flex items-center gap-0.5 font-bold"
            >
              <span>Security Audit Suite</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
