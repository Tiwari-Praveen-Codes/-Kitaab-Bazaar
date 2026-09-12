import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, onAddTextbookClick, onHandshakeClick }) {
  const { walletAddress, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'dashboard-overview', label: 'Ledger Overview', icon: 'dashboard' },
    { id: 'my-listings', label: 'My Inventory', icon: 'menu_book' },
    { id: 'active-escrows', label: 'Active Escrows', icon: 'lock_clock' },
    { id: 'pickup-verification', label: 'Handshake Signer', icon: 'verified_user' },
    { id: 'wallet-settings', label: 'Wallet & SIWE', icon: 'account_balance_wallet' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-surface-container-lowest border-r border-surface-container-high/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between p-space-md lg:py-space-lg lg:px-space-md shrink-0">
      <div className="flex flex-col gap-space-lg">
        {/* Brand in Sidebar */}
        <div className="px-space-sm flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-primary text-base tracking-tight leading-tight">
              Kitaab Bazaar
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant">
              Seller Portal
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-sans text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="pt-2 px-space-xs flex flex-col gap-2">
          <button
            onClick={onAddTextbookClick}
            className="w-full bg-primary hover:bg-primary-container text-on-primary py-2 px-3 rounded-lg font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>List Textbook</span>
          </button>

          <button
            onClick={onHandshakeClick}
            className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-3 rounded-lg font-sans text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base text-primary">qr_code_scanner</span>
            <span>Verify Drop-Off</span>
          </button>
        </div>
      </div>

      {/* Campus DAO Badge in Sidebar */}
      <div className="mt-6 p-space-sm rounded-xl bg-surface-container-low border border-surface-container-high/50">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Campus DAO Node</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p className="font-sans text-xs font-bold text-on-surface">UC Berkeley (EECS)</p>
        <p className="font-mono text-[10px] text-on-surface-variant mt-0.5 truncate">
          {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}` : '0x71C8...392A'}
        </p>
      </div>
    </aside>
  );
}
