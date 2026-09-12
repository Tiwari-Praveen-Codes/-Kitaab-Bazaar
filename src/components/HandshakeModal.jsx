import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import confetti from 'canvas-confetti';

export default function HandshakeModal({ isOpen, onClose }) {
  const { verifyHandshake, books } = useMarketplace();
  const [code, setCode] = useState('');
  const [verifiedBook, setVerifiedBook] = useState(null);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const res = verifyHandshake(code);
    if (res.success) {
      setVerifiedBook(res.book);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log("Confetti trigger", err);
      }
    }
  };

  const handleReset = () => {
    setCode('');
    setVerifiedBook(null);
    onClose();
  };

  const pendingBooks = books.filter(b => b.status === "Escrow Pending");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-space-md sm:p-space-lg flex flex-col max-h-[90vh] overflow-y-auto border border-surface-container-high animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">verified_user</span>
            </div>
            <div>
              <h2 className="font-display text-headline-sm text-on-surface font-bold">Handshake Verification</h2>
              <p className="font-sans text-[11px] text-on-surface-variant">In-Person Campus Book Drop-Off Settle</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {verifiedBook ? (
          /* Success Screen */
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="font-display text-headline-sm text-on-surface font-bold mb-1">
              Handshake Authenticated!
            </h3>
            <p className="font-sans text-xs text-on-surface-variant max-w-sm mb-4">
              Book condition code verified. <span className="font-bold text-primary">₹{(verifiedBook.priceInr || 0).toLocaleString('en-IN')} INR</span> released from escrow to seller wallet.
            </p>

            <div className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container-high text-left font-mono text-xs mb-4">
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Title:</span>
                <span className="font-bold text-on-surface">{verifiedBook.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Handshake Code:</span>
                <span className="font-bold text-emerald-600">#{verifiedBook.handshakeCode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Escrow Status:</span>
                <span className="font-bold text-emerald-700">Settled & Completed</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold rounded-lg shadow-sm"
            >
              Done & Return to Ledger
            </button>
          </div>
        ) : (
          /* Input Screen */
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              When meeting the student at the campus library or student union, ask them for their 6-digit confirmation code on their receipt to release escrow funds.
            </p>

            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Enter Handshake Code
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 font-mono text-sm text-primary font-bold">#</span>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="CLRS-992"
                  className="w-full pl-7 p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl font-mono text-sm font-bold tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                />
              </div>
            </div>

            {/* Helper quick select for demo testing */}
            {pendingBooks.length > 0 && (
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block mb-2">
                  Sample Codes Ready for Drop-off Verification:
                </span>
                <div className="flex flex-wrap gap-2">
                  {pendingBooks.map(b => b.handshakeCode && (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setCode(b.handshakeCode)}
                      className="px-2.5 py-1 rounded-md bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 font-mono text-[11px] font-bold text-primary transition-all shadow-xs"
                    >
                      #{b.handshakeCode} ({b.title.slice(0, 16)}...)
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high/60">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg font-sans text-xs text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Verify & Settle Escrow</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
