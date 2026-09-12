import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentScreen, setCurrentScreen }) {
  const { walletConnected, walletAddress, isAuthenticated, disconnectWallet, formatTtl } = useAuth();

  const screens = [
    { id: 'screen1', label: '1. Landing & Modal', icon: 'account_balance_wallet' },
    { id: 'screen2', label: '2. SIWE Signing', icon: 'key' },
    { id: 'screen3', label: '3. Error Matrix', icon: 'gpp_bad', count: '8' },
    { id: 'screen4', label: '4. Seller Dashboard', icon: 'dashboard' },
    { id: 'screen5', label: '5. Security Suite', icon: 'security' },
    { id: 'catalog', label: 'Campus Catalog', icon: 'auto_stories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-high shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Protocol Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentScreen('screen1')}>
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-primary text-lg tracking-tight">Kitaab</span>
                <span className="font-display font-bold text-secondary-container text-lg tracking-tight">Bazaar</span>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant leading-none">
                EIP-4361 SIWE & Escrow Ledger
              </span>
            </div>
          </div>

          {/* Screen Switcher Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
            {screens.map(screen => {
              const active = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => setCurrentScreen(screen.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{screen.icon}</span>
                  <span>{screen.label}</span>
                  {screen.count && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${active ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-primary'}`}>
                      {screen.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status & Wallet Button */}
          <div className="flex items-center gap-3">
            {/* Mainnet Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>MAINNET / EIP-4361</span>
            </div>

            {/* Wallet State Pill */}
            {walletConnected ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('screen5')}
                  className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container px-3 py-1.5 rounded-full text-on-surface transition-colors"
                  title="View Security & Session"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-mono text-xs font-semibold">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  {isAuthenticated && (
                    <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      SIWE ACTIVE
                    </span>
                  )}
                </button>

                <button
                  onClick={disconnectWallet}
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-full transition-colors"
                  title="Disconnect Wallet"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentScreen('screen1')}
                className="bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">account_balance_wallet</span>
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Screen Switcher Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-surface-container no-scrollbar">
          {screens.map(screen => {
            const active = currentScreen === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => setCurrentScreen(screen.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-sans text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{screen.icon}</span>
                <span>{screen.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
