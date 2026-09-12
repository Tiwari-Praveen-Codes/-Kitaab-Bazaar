import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

export default function ErrorMatrixScreen({ onNavigate }) {
  const { showToast } = useMarketplace();
  const { setChainId, initializeChallenge, walletAddress } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'client' | 'protocol'
  const [dismissedCards, setDismissedCards] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const triggerCardAction = async (id, message, callback) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    showToast(message, 'info', 3000);

    setTimeout(() => {
      if (callback) callback();
      setActionLoading(prev => ({ ...prev, [id]: false }));
      showToast(`Remediation executed for ${id}.`, 'success');
    }, 2000);
  };

  const dismissCard = (id) => {
    setDismissedCards(prev => ({ ...prev, [id]: true }));
    showToast(`Edge case ${id} marked as resolved.`, 'info');
  };

  const copyTelemetryJson = () => {
    const telemetryData = {
      matrixId: "KB-DIAG-ERR8",
      timestamp: new Date().toISOString(),
      standard: "EIP-4361 / EIP-1271",
      diagnostics: [
        { id: "ERR_4001", code: 4001, category: "client", name: "User Rejected Signature", state: "RECOVERED" },
        { id: "ERR_SIG_MISMATCH", code: "ECRECOVER_FAIL", category: "protocol", expected: "0x8a1F...48b3", recovered: "0x3d4E...20cc" },
        { id: "ERR_TTL_EXPIRED", code: "TTL_TIMEOUT", category: "client", ttlMaxMs: 600000, elapsedMs: 840000 },
        { id: "ERR_NONCE_REPLAY", code: "NONCE_CONSUMED", category: "protocol", nonce: "k7b9-8392-f01e" },
        { id: "ERR_CHAIN_MISMATCH", code: "WRONG_NETWORK", category: "client", currentChainId: 42161, targetChainId: 1 },
        { id: "ERR_ORIGIN_SPOOF", code: "DOMAIN_MISMATCH", category: "protocol", origin: "kitaab-bazaar.edu", issuer: "staging.kitaab-bazaar.edu" },
        { id: "ERR_EIP1271_REVERT", code: "MAGIC_MISMATCH", category: "protocol", returned: "0xffffffff", expected: "0x1626ba7e" },
        { id: "ERR_RPC_TIMEOUT", code: "HTTP_504", category: "protocol", upstream: "rpc.mainnet.infura.io", latencyMs: 8240 }
      ]
    };
    navigator.clipboard.writeText(JSON.stringify(telemetryData, null, 2));
    showToast("Raw SIWE Diagnostics JSON exported to system clipboard.", "success");
  };

  const errors = [
    {
      id: "err-1",
      category: "client",
      title: "1. User Rejected Signature",
      code: "Code: 4001",
      badge: "User Abort",
      icon: "cancel_presentation",
      description: "The signature request was cancelled in your wallet. No data was signed.",
      traceTitle: "Telemetry Trace",
      traceContent: "eth_signTypedData_v4: rejected by user (code: 4001, provider: MetaMask/Injected)",
      actionLabel: "Try Again",
      actionMsg: "Re-requesting wallet signature popup...",
      onAction: () => onNavigate('screen2'),
    },
    {
      id: "err-2",
      category: "protocol",
      title: "2. Invalid Signature",
      code: "Ecrecover Misalignment",
      badge: "Key Mismatch",
      icon: "key_off",
      description: "The recovered public address does not match the connected wallet address.",
      traceTitle: "Address Diagnostic",
      traceCustom: (
        <div className="space-y-0.5 font-mono text-[10px]">
          <p className="text-on-surface truncate"><span className="text-on-surface-variant">Expected:</span> 0x8a1F...48b3</p>
          <p className="text-error truncate font-bold"><span className="text-on-surface-variant">Recovered:</span> 0x3d4E...20cc</p>
        </div>
      ),
      actionLabel: "Retry Signing",
      actionMsg: "Refreshing signer pairing and re-invoking SIWE...",
      onAction: () => onNavigate('screen2'),
    },
    {
      id: "err-3",
      category: "client",
      title: "3. Expired Message",
      code: "SIWE TTL Exceeded",
      badge: "Window Expired",
      icon: "timer_off",
      description: "The 10-minute validity window for this SIWE message has lapsed.",
      traceTitle: "Time Boundary Breakdown",
      traceCustom: (
        <div className="space-y-0.5 font-mono text-[10px]">
          <p className="text-on-surface"><span className="text-on-surface-variant">Issued At:</span> 2025-05-18T10:14:02Z</p>
          <p className="text-error font-bold"><span className="text-on-surface-variant">Expiration:</span> 2025-05-18T10:24:02Z (+14m elapsed)</p>
        </div>
      ),
      actionLabel: "Generate Fresh Request",
      actionMsg: "Generating synchronized UTC timestamp challenge...",
      onAction: () => initializeChallenge(walletAddress),
    },
    {
      id: "err-4",
      category: "protocol",
      title: "4. Invalid Nonce",
      code: "Anti-Replay Protection",
      badge: "Consumed Nonce",
      icon: "security_update_warning",
      description: "This nonce has already been consumed or timed out to prevent replay attacks.",
      traceTitle: "State Verification",
      traceContent: "Nonce: k7b9-8392-f01e (State: Revoked/Used Single-Time Token)",
      actionLabel: "Get New Nonce",
      actionMsg: "Requesting new cryptographic entropy nonce...",
      onAction: () => initializeChallenge(walletAddress),
    },
    {
      id: "err-5",
      category: "client",
      title: "5. Wrong Network",
      code: "Chain Mismatch",
      badge: "Unsupported EVM",
      icon: "hub",
      description: "Connected to Arbitrum One (Chain ID 42161). Kitaab Bazaar requires Ethereum Mainnet (Chain ID 1) or Sepolia.",
      traceTitle: "EVM RPC Configuration",
      traceCustom: (
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="text-error">Current: 42161 (Arbitrum)</span>
          <span className="text-emerald-700 font-bold">Target: 1 (Mainnet) / 11155111</span>
        </div>
      ),
      actionLabel: "Switch Network",
      actionMsg: "Submitting wallet_switchEthereumChain (0x1)...",
      onAction: () => setChainId(1),
    },
    {
      id: "err-6",
      category: "protocol",
      title: "6. Wrong Domain",
      code: "Origin Guard",
      badge: "Host Spoofing Check",
      icon: "domain_verification",
      description: "Security mismatch: message issued for staging.kitaab-bazaar.edu but signed on production.",
      traceTitle: "Host Invariance Violation",
      traceCustom: (
        <div className="space-y-0.5 font-mono text-[10px]">
          <p className="text-on-surface"><span className="text-on-surface-variant">Issuer Domain:</span> staging.kitaab-bazaar.edu</p>
          <p className="text-error font-bold"><span className="text-on-surface-variant">Active Origin:</span> kitaab-bazaar.edu</p>
        </div>
      ),
      actionLabel: "Refresh Session",
      actionMsg: "Flushing origin storage & aligning cookies...",
      onAction: () => initializeChallenge(walletAddress),
    },
    {
      id: "err-7",
      category: "protocol",
      title: "7. Smart-Account Verification Failure (EIP-1271)",
      code: "EIP-1271 Check",
      badge: "Contract Revert",
      icon: "account_balance_wallet",
      description: "Contract wallet call isValidSignature returned 0xffffffff instead of 0x1626ba7e. Ensure account is deployed on this chain.",
      traceTitle: "Contract Bytecode Return",
      traceCustom: (
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="text-error font-bold">0xffffffff (Failure)</span>
          <span className="text-on-surface">Magic: 0x1626ba7e</span>
        </div>
      ),
      actionLabel: "View Contract / Retry",
      actionMsg: "Connecting to Etherscan Explorer contract inspector...",
      onAction: () => window.open('https://eips.ethereum.org/EIPS/eip-1271', '_blank'),
    },
    {
      id: "err-8",
      category: "protocol",
      title: "8. Server Verification Failure",
      code: "Infra Health Check",
      badge: "RPC Timeout",
      icon: "dns",
      description: "Backend verification service could not validate signature hash with Ethereum RPC node.",
      traceTitle: "Upstream Gateway Diagnostic",
      traceContent: "504 Gateway Timeout: rpc.mainnet.infura.io node latency > 8000ms",
      actionLabel: "Switch RPC / Retry",
      actionMsg: "Switching backend fallback RPC provider (Alchemy / Cloudflare)...",
      onAction: () => showToast("Fallback RPC cluster connected.", "success"),
    }
  ];

  const filteredErrors = errors.filter(err => {
    if (activeFilter === 'all') return true;
    return err.category === activeFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
      {/* Master Security Notice Banner */}
      <div className="bg-error-container text-on-error-container p-5 sm:p-6 rounded-2xl shadow-sm mb-8 relative overflow-hidden border border-error/20">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-error text-on-error shrink-0 mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-2xl fill-1">gpp_bad</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider bg-error/20 text-on-error-container px-2 py-0.5 rounded-full font-bold">
                Protocol Guard: SIWE EIP-4361
              </span>
              <span className="font-mono text-xs opacity-75">ID: KB-DIAG-ERR8</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-on-error-container">
              Authentication Unsuccessful — Security Checks Failed
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-error-container/90 mt-1 leading-relaxed">
              Cryptographic handshake verification halted. Below is the active SIWE failure taxonomy matrix. Select an edge case to inspect cryptographic payload traces, verification telemetry, and recovery procedures.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & System Status Strip */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-surface-container-low p-4 rounded-2xl mb-6 border border-surface-container-high">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
          <span className="font-sans text-xs sm:text-sm text-on-surface font-bold">
            Security Diagnostic Matrix
          </span>
          <span className="font-mono text-xs text-on-surface-variant ml-2 px-2.5 py-0.5 bg-surface-container rounded-full border border-surface-container-high">
            8 Conditions Mapped
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`font-sans text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            All Failures
          </button>
          <button
            onClick={() => setActiveFilter('client')}
            className={`font-sans text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeFilter === 'client'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Wallet / Client
          </button>
          <button
            onClick={() => setActiveFilter('protocol')}
            className={`font-sans text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeFilter === 'protocol'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Protocol / Consensus
          </button>
        </div>
      </div>

      {/* Diagnostic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredErrors.map((err) => {
          const isDismissed = dismissedCards[err.id];
          const isLoading = actionLoading[err.id];

          return (
            <div
              key={err.id}
              className={`flex flex-col justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-high transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isDismissed ? 'opacity-35 pointer-events-none' : ''
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                    {err.code}
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
                    {err.badge}
                  </span>
                </div>

                {/* Title & icon */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-error fill-1 text-xl">
                    {err.icon}
                  </span>
                  <h2 className="font-display text-base font-bold text-on-surface">
                    {err.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="font-sans text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {err.description}
                </p>

                {/* Telemetry Trace Box */}
                <div className="bg-surface-container-low p-3 rounded-xl mb-4 border border-surface-container-high">
                  <div className="text-on-surface-variant font-mono text-[10px] uppercase font-bold mb-1">
                    {err.traceTitle}
                  </div>
                  {err.traceCustom ? (
                    err.traceCustom
                  ) : (
                    <p className="font-mono text-[10px] text-on-surface break-all leading-relaxed">
                      {err.traceContent}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high/60">
                <button
                  type="button"
                  disabled={isLoading || isDismissed}
                  onClick={() => triggerCardAction(err.id, err.actionMsg, err.onAction)}
                  className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold py-2.5 px-3 rounded-lg text-center shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  {isLoading && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                  <span>{isLoading ? 'Verifying...' : err.actionLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => dismissCard(err.id)}
                  disabled={isDismissed}
                  className="bg-surface-container hover:bg-surface-container-highest text-on-surface font-sans text-xs font-semibold py-2.5 px-3 rounded-lg transition"
                >
                  {isDismissed ? 'Resolved' : 'Dismiss'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Action Footer */}
      <div className="mt-8 p-6 bg-surface-container-low rounded-2xl flex items-center justify-between flex-wrap gap-4 border border-surface-container-high">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">terminal</span>
          </div>
          <div>
            <p className="font-sans text-sm text-on-surface font-bold">
              Need assistance with your campus credential?
            </p>
            <p className="font-sans text-xs text-on-surface-variant">
              Kitaab Bazaar Security Desk is available for student and faculty engineering nodes.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyTelemetryJson}
            className="font-sans text-xs font-bold py-2.5 px-4 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-outline-variant/30 transition shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>Copy Telemetry JSON</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('screen1')}
            className="font-sans text-xs font-bold py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
