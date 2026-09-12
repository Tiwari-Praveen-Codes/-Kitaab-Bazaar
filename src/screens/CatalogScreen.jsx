import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

export default function CatalogScreen({ onNavigate }) {
  const { books, buyBookEscrow } = useMarketplace();
  const { walletConnected } = useAuth();
  const [selectedCampus, setSelectedCampus] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');
  const [buyingBook, setBuyingBook] = useState(null);
  const [escrowSuccess, setEscrowSuccess] = useState(null);

  const filtered = books.filter(b => {
    if (selectedCampus !== 'All' && b.campus !== selectedCampus) return false;
    if (selectedDept !== 'All' && b.department !== selectedDept) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.courseCode.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleBuy = (book) => {
    if (!walletConnected) {
      onNavigate('screen1');
      return;
    }
    setBuyingBook(book);
  };

  const confirmEscrowPurchase = () => {
    if (!buyingBook) return;
    const res = buyBookEscrow(buyingBook.id, "Stanford CS / Student Node");
    setEscrowSuccess({ ...buyingBook, ...res });
    setBuyingBook(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-primary text-on-primary rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary-container font-mono text-xs font-bold text-tertiary-fixed">
              CAMPUS RESALE REGISTRY
            </span>
            <span className="font-mono text-xs text-on-primary/75">
              42 Participating Universities
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-surface-bright">
            Decentralized Engineering Textbook Catalog
          </h1>
          <p className="font-sans text-xs sm:text-sm text-surface-container-highest/90 leading-relaxed">
            Direct student-to-student textbook swap. Funds are held in decentralized smart contract escrow until you inspect and accept the book in person at the campus library.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-sm border border-surface-container-high mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Campus Filter */}
          <div className="flex items-center gap-2">
            <label className="font-sans text-xs font-bold text-on-surface-variant">Campus:</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-1.5 font-sans text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Campuses</option>
              <option value="UC Berkeley">UC Berkeley</option>
              <option value="Stanford University">Stanford</option>
              <option value="MIT">MIT</option>
              <option value="CMU">CMU</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <label className="font-sans text-xs font-bold text-on-surface-variant">Dept:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-1.5 font-sans text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Departments</option>
              <option value="EECS">EECS</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search title, author, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl font-sans text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Book Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(book => (
          <div
            key={book.id}
            className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            {/* Image & Badge */}
            <div className="relative h-44 w-full bg-surface-container overflow-hidden">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-primary/90 text-on-primary font-mono text-[10px] font-bold backdrop-blur-xs">
                  {book.courseCode}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 text-on-surface font-sans text-[10px] font-bold backdrop-blur-xs">
                  {book.campus}
                </span>
              </div>
              <span
                className={`absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  book.status === 'Available'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {book.status}
              </span>
            </div>

            {/* Book Info */}
            <div className="p-4 flex flex-col gap-1 flex-1 justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-on-surface line-clamp-2 leading-snug">
                  {book.title}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  {book.author}
                </p>
                <p className="font-mono text-[10px] text-outline mt-0.5">
                  {book.edition}
                </p>
                <div className="mt-2 text-[11px] font-sans text-on-surface-variant">
                  <span className="font-semibold text-primary">Condition:</span> {book.condition}
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <div>
                  <span className="font-display text-lg font-extrabold text-primary">
                    ₹{(book.priceInr || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant ml-1">INR</span>
                </div>

                {book.status === 'Available' ? (
                  <button
                    onClick={() => handleBuy(book)}
                    className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Buy (Escrow)</span>
                  </button>
                ) : (
                  <span className="font-mono text-xs text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded-lg">
                    In Escrow #{book.handshakeCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Escrow Purchase Modal */}
      {buyingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-surface-container-high">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">lock_clock</span>
                <h3 className="font-display text-lg font-bold text-on-surface">Lock Escrow Payment</h3>
              </div>
              <button onClick={() => setBuyingBook(null)} className="p-1 rounded-full hover:bg-surface-container">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 font-sans text-xs text-on-surface">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                <p className="font-bold text-sm text-on-surface">{buyingBook.title}</p>
                <p className="text-on-surface-variant text-xs mt-0.5">{buyingBook.courseCode} • {buyingBook.campus}</p>
                <div className="mt-2 font-display text-base font-bold text-primary">
                  ₹{(buyingBook.priceInr || 0).toLocaleString('en-IN')} INR <span className="font-mono text-xs font-normal text-on-surface-variant">({buyingBook.priceEth} ETH)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-highest/60 flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">verified_user</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Your funds are locked in the Kitaab Bazaar Escrow contract. You will receive a unique Handshake Code to give the seller when you inspect the book in person.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuyingBook(null)}
                  className="px-4 py-2 rounded-lg font-sans text-xs text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmEscrowPurchase}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold rounded-lg shadow-sm"
                >
                  Confirm & Lock INR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Success Receipt Modal */}
      {escrowSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl p-6 border border-surface-container-high text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h3 className="font-display text-xl font-bold text-on-surface mb-1">
              Escrow Locked Successfully!
            </h3>
            <p className="font-sans text-xs text-on-surface-variant max-w-xs mx-auto mb-4">
              Your payment is safely guarded on-chain. Present your Handshake Code to the seller upon physical pickup at the campus library.
            </p>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high mb-4">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold block mb-1">
                Your In-Person Pickup Handshake Code:
              </span>
              <div className="font-mono text-2xl font-extrabold text-primary tracking-widest py-1 bg-surface-container-lowest rounded-lg border border-primary/20">
                #{escrowSuccess.handshakeCode}
              </div>
              <span className="font-mono text-[10px] text-emerald-700 font-semibold mt-2 block">
                {escrowSuccess.txId} • Mainnet Escrow Pool
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEscrowSuccess(null);
                  onNavigate('screen4');
                }}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold rounded-lg shadow-sm"
              >
                View in Seller Ledger
              </button>
              <button
                onClick={() => setEscrowSuccess(null)}
                className="py-2.5 px-4 rounded-lg bg-surface-container text-on-surface font-sans text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
