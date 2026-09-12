import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import Sidebar from '../components/Sidebar';

export default function SecurityAuditScreen({ onNavigate }) {
  const {
    walletAddress,
    walletType,
    isSmartContractWallet,
    chainId,
    isAuthenticated,
    formatTtl,
    revokeSession,
    isForbidden403,
    setIsForbidden403,
    isSessionExpired,
    setIsSessionExpired,
  } = useAuth();

  const { showToast } = useMarketplace();
  const [copied, setCopied] = useState(false);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress || "0x71C8A9b7f523D4e19F421bA4A16dC955047b392A");
    setCopied(true);
    showToast("Wallet address copied to clipboard.", "info");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRevoke = () => {
    revokeSession();
    showToast("Session token revoked. Signed out of seller vault.", "info");
    onNavigate('screen1');
  };

  const simulate403Forbidden = () => {
    setIsForbidden403(true);
    showToast("Simulated 403 Forbidden: Wallet address does not match vault owner.", "error");
  };

  const simulateSessionExpiry = () => {
    setIsSessionExpired(true);
    showToast("Simulated Session Expiry: TTL lapsed.", "error");
  };

  const resolveSecurityState = () => {
    setIsForbidden403(false);
    setIsSessionExpired(false);
    showToast("Security challenge resolved. Session restored.", "success");
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-surface">
      <Sidebar
        activeTab="wallet-settings"
        setActiveTab={(tab) => {
          if (tab === 'dashboard-overview') onNavigate('screen4');
          else onNavigate('screen4');
        }}
        onAddTextbookClick={() => onNavigate('screen4')}
        onHandshakeClick={() => onNavigate('screen4')}
      />

      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Top Meta Banner & Diagnostic Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[11px] mb-1">
                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PROTOCOL SECURITY SUITE</span>
                <span>/</span>
                <span className="text-primary font-bold">EIP-4361 VERIFICATION AUDIT</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
                Identity Governance & Access Control
              </h2>
            </div>

            {/* Cryptographic Quick Status Pill */}
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full shadow-xs border border-surface-container-high self-start md:self-auto">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="font-mono text-xs text-on-surface font-bold">
                  {isAuthenticated ? 'SIWE SESSION ACTIVE' : 'SIGN-IN REQUIRED'}
                </span>
              </div>
              <span className="text-outline-variant">•</span>
              <span className="font-mono text-xs text-on-surface-variant">
                TTL: {isAuthenticated ? formatTtl() : '0m 00s'}
              </span>
            </div>
          </div>

          {/* SECTION 1: Account Security & SIWE Cryptographic Identity */}
          <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6 pb-6 border-b border-surface-container-high">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="p-2 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-lg">verified_user</span>
                  </span>
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    Account Security & SIWE Cryptographic Identity
                  </h3>
                </div>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Your seller identity is determined strictly by the cryptographic signature verified by our server. Knowing or sharing a public wallet address alone grants zero permissions.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start">
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-2.5 rounded-xl font-sans text-xs font-bold hover:bg-error hover:text-on-error transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">power_settings_new</span>
                  <span>Sign Out & Revoke Session Token</span>
                </button>
              </div>
            </div>

            {/* Security Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Item 1: Connected Wallet */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant font-bold">CONNECTED WALLET</span>
                  <span className="material-symbols-outlined text-base text-primary">account_balance_wallet</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-on-surface font-bold truncate">
                    {walletAddress || '0x71C8...392A'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyWallet}
                    className="flex items-center gap-1 font-sans text-xs text-primary hover:text-primary-container bg-surface-container px-2 py-1 rounded-lg transition-colors font-semibold"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Item 2: Verification Protocol */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant font-bold">VERIFICATION TYPE</span>
                  <span className="material-symbols-outlined text-base text-primary">fingerprint</span>
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-on-surface block">EIP-4361 Standard</span>
                  <span className="font-mono text-[10px] text-on-surface-variant">Server-Verified Cryptographic Signature</span>
                </div>
              </div>

              {/* Item 3: Wallet Signer Type */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant font-bold">WALLET TYPE</span>
                  <span className="material-symbols-outlined text-base text-primary">key</span>
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-on-surface block">
                    {isSmartContractWallet ? 'Smart Contract Account' : 'EOA Security'}
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    {walletType} / secp256k1 Curve
                  </span>
                </div>
              </div>

              {/* Item 4: Network & Chain ID */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant font-bold">NETWORK DOMAIN</span>
                  <span className="material-symbols-outlined text-base text-primary">hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-sans text-xs font-bold text-on-surface">Ethereum Mainnet</span>
                  <span className="font-mono text-[10px] text-on-surface-variant px-1.5 py-0.5 bg-surface-container rounded font-semibold">
                    (Chain ID: {chainId})
                  </span>
                </div>
              </div>

              {/* Item 5: Nonce Audit Record */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant font-bold">NONCE AUDIT RECORD</span>
                  <span className="material-symbols-outlined text-base text-primary">tag</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">#8f9b2a1c</span>
                  <span className="font-sans text-[11px] text-on-surface-variant">verified single-use entropy</span>
                </div>
              </div>

              {/* Item 6: Last Authenticated Device */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant font-bold">LAST SIGN-IN CLIENT</span>
                  <span className="material-symbols-outlined text-base text-primary">devices</span>
                </div>
                <div>
                  <span className="font-sans text-xs font-bold text-on-surface">Today at 6:32 PM UTC</span>
                  <span className="font-mono text-[10px] text-on-surface-variant block">Chrome / Firefox (Antigravity Engine)</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof Visualizer */}
            <div className="bg-surface-container p-4 rounded-xl border border-surface-container-high">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">terminal</span>
                  <span className="font-mono text-xs text-on-surface font-bold uppercase tracking-wider">
                    Active Session Payload Hash
                  </span>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant font-semibold">
                  HMAC-SHA256 • Server Timestamp Bound
                </span>
              </div>
              <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-[11px] text-on-surface-variant break-all overflow-x-auto select-all leading-relaxed border border-surface-container-high">
                kitaab-bazaar.edu wants you to sign in with your Ethereum account:<br />
                <span className="text-primary font-bold">{walletAddress || '0x71C8A9b7f523D4e19F421bA4A16dC955047b392A'}</span><br />
                URI: https://kitaab-bazaar.edu/escrow/vault-auth • Version: 1 • Nonce: 8f9b2a1c • Issued: 2025-02-23T18:32:10Z
              </div>
            </div>
          </div>

          {/* Interactive Security Sandbox Triggers */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-container-high">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-secondary font-bold block">
                  Security Sandbox Controls
                </span>
                <h3 className="font-display text-base font-bold text-on-surface">
                  Simulate Access Control & Intercept States
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={simulate403Forbidden}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 font-sans text-xs font-bold transition-colors"
                >
                  Test 403 Forbidden Interceptor
                </button>
                <button
                  type="button"
                  onClick={simulateSessionExpiry}
                  className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-900 hover:bg-rose-200 font-sans text-xs font-bold transition-colors"
                >
                  Test Session Expiry
                </button>
                {(isForbidden403 || isSessionExpired) && (
                  <button
                    type="button"
                    onClick={resolveSecurityState}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-sans text-xs font-bold"
                  >
                    Reset Challenge
                  </button>
                )}
              </div>
            </div>

            {/* SECTIONS 2 & 3: Security Intercept States (Split Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* SECTION 2: 403 Unauthorized State Card */}
              <div className={`bg-surface-container-lowest rounded-2xl shadow-sm border p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
                isForbidden403 ? 'border-secondary-container ring-2 ring-secondary-container' : 'border-surface-container-high'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary-container"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-high shadow-xs">
                      <span className="material-symbols-outlined text-2xl text-secondary">gpp_maybe</span>
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-on-secondary font-mono text-[10px] font-bold">
                        !
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                      STATUS: 403 FORBIDDEN
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-on-surface mb-2">
                    You don't have access to this seller account.
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant mb-4 leading-relaxed">
                    The currently connected wallet does not match the cryptographic identity authorized for this vault. Connect the registered owner key to proceed.
                  </p>

                  <div className="bg-surface-container-low p-3 rounded-xl mb-4 font-mono text-[10px] space-y-1 border border-surface-container-high">
                    <p className="text-on-surface"><span className="text-on-surface-variant">Required Owner:</span> 0x71C8...392A (Prof. EECS Vault)</p>
                    <p className="text-error font-bold"><span className="text-on-surface-variant">Connected Signer:</span> 0x98B2...410F (Unauthorized)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForbidden403(false);
                      onNavigate('screen1');
                    }}
                    className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold py-2.5 px-3 rounded-lg text-center transition shadow-xs"
                  >
                    Switch to Authorized Wallet
                  </button>
                </div>
              </div>

              {/* SECTION 3: Session Expired Interceptor Card */}
              <div className={`bg-surface-container-lowest rounded-2xl shadow-sm border p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
                isSessionExpired ? 'border-error ring-2 ring-error' : 'border-surface-container-high'
              }`}>
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-error"></div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-high shadow-xs">
                      <span className="material-symbols-outlined text-2xl text-error">timer_off</span>
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-white font-mono text-[10px] font-bold">
                        ⏱
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                      STATUS: 401 EXPIRED
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-on-surface mb-2">
                    SIWE Authentication Token Expired
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant mb-4 leading-relaxed">
                    The 45-minute cryptographic session validity window has elapsed. Re-sign a fresh challenge to resume managing textbook listings and payouts.
                  </p>

                  <div className="bg-surface-container-low p-3 rounded-xl mb-4 font-mono text-[10px] space-y-1 border border-surface-container-high">
                    <p className="text-on-surface"><span className="text-on-surface-variant">Session Issued:</span> 45 minutes ago</p>
                    <p className="text-error font-bold"><span className="text-on-surface-variant">Status:</span> Nonce invalidated on server</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-surface-container-high/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSessionExpired(false);
                      onNavigate('screen2');
                    }}
                    className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold py-2.5 px-3 rounded-lg text-center transition shadow-xs"
                  >
                    Re-Authenticate with SIWE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
