import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Toast() {
  const { toast } = useMarketplace();

  if (!toast) return null;

  const bgClasses = {
    success: 'bg-emerald-900 border border-emerald-700 text-emerald-100',
    error: 'bg-rose-950 border border-rose-800 text-rose-100',
    info: 'bg-inverse-surface border border-outline-variant/30 text-inverse-on-surface',
  }[toast.type] || 'bg-inverse-surface text-inverse-on-surface';

  const iconName = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  }[toast.type] || 'info';

  return (
    <div className="fixed bottom-6 right-6 max-w-md z-50 animate-bounce duration-300">
      <div className={`${bgClasses} p-space-md rounded-xl shadow-2xl flex items-center gap-space-sm backdrop-blur-md`}>
        <span className="material-symbols-outlined text-tertiary-fixed text-headline-sm shrink-0">
          {iconName}
        </span>
        <span className="font-body-sm text-body-sm font-medium leading-snug">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
