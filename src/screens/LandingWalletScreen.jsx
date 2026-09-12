import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WalletModal from '../components/WalletModal';

export default function LandingWalletScreen({ onNavigate }) {
  const { walletConnected, walletAddress, disconnectWallet } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleWalletSelect = (walletType) => {
    // Navigate to Screen 2 (SIWE Signing) after wallet connects
    onNavigate('screen2');
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Subtle decorative ambient backing glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-surface-container-highest/60 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow"></div>

      {/* Main Collegiate Container Card */}
      <main className="w-full max-w-xl mx-auto">
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high/80 p-6 sm:p-8 relative overflow-hidden">
          {/* Top Bar: Logo & Academic Domain Badge */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-lg">menu_book</span>
              </div>
              <span className="font-display font-bold text-primary text-xl">
                Kitaab<span className="text-secondary-container">Bazaar</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MAINNET / EIP-4361</span>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex p-1 bg-surface-container-low rounded-xl mb-6">
            <button
              type="button"
              className="flex-1 py-2 text-center font-sans text-xs font-bold rounded-lg bg-surface-container-lowest text-primary shadow-sm transition-all"
            >
              Sign In (SIWE)
            </button>
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="flex-1 py-2 text-center font-sans text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore Catalog</span>
              <span className="material-symbols-outlined text-sm">arrow_outward</span>
            </button>
          </div>

          {/* Tagline & Core Header */}
          <div className="mb-6">
            <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold mb-1 block">
              Engineering textbooks, passed forward.
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-on-surface font-bold tracking-tight mb-2">
              Log in with your wallet.
            </h1>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              Connect your EVM wallet and sign a cryptographically verifiable login challenge. Zero passwords, zero OTPs, total peer-to-peer security.
            </p>
          </div>

          {/* Security Explainer Callout Box */}
          <div className="bg-surface-container-low border border-surface-container-high rounded-xl p-4 mb-6">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-primary-container text-on-primary shrink-0 mt-0.5 shadow-sm">
                <span className="material-symbols-outlined text-lg leading-none">shield_lock</span>
              </div>
              <div>
                <div className="font-sans text-xs font-bold text-on-surface mb-0.5">
                  Cryptographic Authentication Guard
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-normal">
                  Your wallet address alone is not enough to access seller escrow. Kitaab Bazaar verifies your signed EIP-4361 payload on-chain and against our backend.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Flow Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                Authentication Protocol
              </span>
              <span className="font-mono text-[11px] text-primary font-semibold">
                SIWE SPEC v1.0.0
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-container-low p-2 rounded-xl">
              <div className="bg-surface-container-lowest rounded-lg p-2.5 flex flex-col gap-0.5 shadow-xs border border-surface-container-high">
                <span className="font-mono text-[11px] text-primary font-bold">01</span>
                <span className="font-sans text-xs text-on-surface leading-tight font-bold">Connect Wallet</span>
                <span className="font-mono text-[10px] text-primary font-medium">
                  {walletConnected ? 'Connected ✓' : 'In Progress'}
                </span>
              </div>
              <div className="p-2.5 flex flex-col gap-0.5 opacity-70">
                <span className="font-mono text-[11px] text-on-surface-variant font-bold">02</span>
                <span className="font-sans text-xs text-on-surface leading-tight font-medium">Sign Message</span>
                <span className="font-mono text-[10px] text-on-surface-variant">Pending</span>
              </div>
              <div className="p-2.5 flex flex-col gap-0.5 opacity-70">
                <span className="font-mono text-[11px] text-on-surface-variant font-bold">03</span>
                <span className="font-sans text-xs text-on-surface leading-tight font-medium">Verify Sig</span>
                <span className="font-mono text-[10px] text-on-surface-variant">Server EIP-1271</span>
              </div>
              <div className="p-2.5 flex flex-col gap-0.5 opacity-70">
                <span className="font-mono text-[11px] text-on-surface-variant font-bold">04</span>
                <span className="font-sans text-xs text-on-surface leading-tight font-medium">Seller Access</span>
                <span className="font-mono text-[10px] text-on-surface-variant">Session Granted</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          {walletConnected ? (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onNavigate('screen2')}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-container text-on-primary font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-lg">key</span>
                <span>Proceed to SIWE Message Signing</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWalletModalOpen(true)}
                className="w-full py-2.5 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface font-sans text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Switch Connected Wallet ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)})</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="openModalBtn"
              onClick={() => setIsWalletModalOpen(true)}
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary-container text-on-primary font-sans text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              <span>Choose Wallet to Proceed</span>
            </button>
          )}

          {/* Auxiliary links */}
          <div className="mt-6 pt-4 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-on-surface-variant font-sans">
            <button onClick={() => onNavigate('screen3')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">bug_report</span>
              <span>Test SIWE Error Matrix</span>
            </button>
            <button onClick={() => onNavigate('catalog')} className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">search</span>
              <span>Browse 42 Campus Listings</span>
            </button>
          </div>
        </div>
      </main>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleWalletSelect}
      />
    </div>
  );
}
