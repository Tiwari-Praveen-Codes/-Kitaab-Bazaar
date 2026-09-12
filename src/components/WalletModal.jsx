import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';

export default function WalletModal({ isOpen, onClose, onSelectWallet }) {
  const { connectWallet } = useAuth();
  const { showToast } = useMarketplace();
  const [hasInjected, setHasInjected] = useState(false);
  const [showHexInput, setShowHexInput] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [connecting, setConnecting] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasInjected(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleConnect = async (type, addr = null) => {
    setConnecting(type);
    try {
      const res = await connectWallet(type, addr);
      if (res && res.success) {
        showToast(`Connected to ${type} (${res.address.slice(0, 6)}...${res.address.slice(-4)})`, 'success');
        if (onSelectWallet) onSelectWallet(type);
        onClose();
      } else {
        showToast(`Connection failed: ${res?.error || 'Unknown error'}`, 'error');
      }
    } finally {
      setConnecting(null);
    }
  };

  const handleHexSubmit = (e) => {
    e.preventDefault();
    if (!customAddress.startsWith('0x') || customAddress.length !== 42) {
      showToast("Please enter a valid 42-character 0x Ethereum address.", "error");
      return;
    }
    handleConnect('Manual Hex', customAddress);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-space-md sm:p-space-lg flex flex-col max-h-[90vh] overflow-y-auto border border-surface-container-high animate-in fade-in zoom-in-95">
        {/* Modal Navigation & Header */}
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high/60">
          <div className="flex items-center gap-space-xs">
            {showHexInput && (
              <button
                onClick={() => setShowHexInput(false)}
                className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                title="Back"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
            )}
            <h2 className="font-display text-headline-sm text-on-surface font-bold">
              {showHexInput ? 'Manual Wallet Input' : 'Connect Wallet'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="Cancel"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {showHexInput ? (
          /* Manual Hex Address Input */
          <form onSubmit={handleHexSubmit} className="flex flex-col gap-4 py-2">
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Enter any EVM wallet address to simulate or inspect authentication challenges.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs font-semibold text-on-surface">
                Public Ethereum Address (0x...)
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="0x71C8A9b7f523D4e19F421bA4A16dC955047b392A"
                className="w-full p-3 bg-surface-container-low border border-outline-variant/50 rounded-xl font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowHexInput(false)}
                className="px-4 py-2 rounded-lg font-sans text-xs text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-sans text-xs font-bold shadow-sm"
              >
                Connect Hex Address
              </button>
            </div>
          </form>
        ) : (
          /* Wallet list */
          <div className="flex flex-col gap-4">
            {/* Section: Browser Wallets (EOA) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  Browser Wallets (EOA)
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  ECDSA secp256k1
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {/* MetaMask */}
                <button
                  type="button"
                  onClick={() => handleConnect(hasInjected ? 'Injected' : 'MetaMask')}
                  disabled={connecting !== null}
                  className="group flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-amber-600 font-mono font-bold">
                      <span className="material-symbols-outlined text-2xl">token</span>
                    </div>
                    <div>
                      <div className="font-sans text-sm font-bold text-on-surface group-hover:text-primary">
                        MetaMask
                      </div>
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        {hasInjected ? 'Browser Extension Injected' : 'ECDSA Injected Provider'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-tertiary-fixed text-on-tertiary-fixed font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
                    {hasInjected ? 'Extension Ready' : 'Detected'}
                  </span>
                </button>

                {/* Rabby Wallet */}
                <button
                  type="button"
                  onClick={() => handleConnect('Rabby')}
                  disabled={connecting !== null}
                  className="group flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary font-mono font-bold">
                      <span className="material-symbols-outlined text-2xl">security</span>
                    </div>
                    <div>
                      <div className="font-sans text-sm font-bold text-on-surface group-hover:text-primary">
                        Rabby Wallet
                      </div>
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        Multi-chain DeFi Guard
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-surface-container text-on-surface-variant font-medium">
                    Available
                  </span>
                </button>

                {/* Coinbase Wallet */}
                <button
                  type="button"
                  onClick={() => handleConnect('Coinbase')}
                  disabled={connecting !== null}
                  className="group flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary-container font-mono font-bold">
                      <span className="material-symbols-outlined text-2xl">credit_card</span>
                    </div>
                    <div>
                      <div className="font-sans text-sm font-bold text-on-surface group-hover:text-primary">
                        Coinbase Wallet
                      </div>
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        Mobile & Extension
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] bg-surface-container text-on-surface-variant font-medium">
                    Available
                  </span>
                </button>
              </div>
            </div>

            {/* Section: Smart Contract Wallets (ERC-4337 / Safe) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  Smart Contract Accounts (AA)
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-primary-fixed text-primary font-bold">
                  ERC-1271 Supported
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {/* Safe (Gnosis) */}
                <button
                  type="button"
                  onClick={() => handleConnect('Safe')}
                  disabled={connecting !== null}
                  className="group flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary font-mono font-bold">
                      <span className="material-symbols-outlined text-2xl">lock_clock</span>
                    </div>
                    <div>
                      <div className="font-sans text-sm font-bold text-on-surface group-hover:text-primary flex items-center gap-1.5">
                        <span>Safe</span>
                        <span className="font-mono text-[10px] text-on-surface-variant font-normal">(Gnosis Safe)</span>
                      </div>
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        Multi-signature Treasury
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-lg">
                    chevron_right
                  </span>
                </button>

                {/* Biconomy */}
                <button
                  type="button"
                  onClick={() => handleConnect('Biconomy')}
                  disabled={connecting !== null}
                  className="group flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-amber-600 font-mono font-bold">
                      <span className="material-symbols-outlined text-2xl">bolt</span>
                    </div>
                    <div>
                      <div className="font-sans text-sm font-bold text-on-surface group-hover:text-primary">
                        Biconomy
                      </div>
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        Gasless ERC-4337 Session
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-lg">
                    chevron_right
                  </span>
                </button>

                {/* Argent */}
                <button
                  type="button"
                  onClick={() => handleConnect('Argent')}
                  disabled={connecting !== null}
                  className="group flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-center text-rose-600 font-mono font-bold">
                      <span className="material-symbols-outlined text-2xl">shield_person</span>
                    </div>
                    <div>
                      <div className="font-sans text-sm font-bold text-on-surface group-hover:text-primary">
                        Argent
                      </div>
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        Guardian Recovery Enabled
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-lg">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            {/* Smart Account Note */}
            <div className="p-3 rounded-xl bg-surface-container-high/70 border border-surface-container-highest">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">verified_user</span>
                <p className="font-mono text-[11px] text-on-surface leading-snug">
                  Smart contract wallets verified via on-chain contract <span className="font-bold text-primary">isValidSignature (EIP-1271)</span> standard.
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/60">
              <button
                type="button"
                onClick={() => setShowHexInput(true)}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-mono text-xs text-primary font-bold flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">terminal</span>
                <span>Manual Hex</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg font-sans text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
