import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import Sidebar from '../components/Sidebar';
import AddTextbookModal from '../components/AddTextbookModal';
import HandshakeModal from '../components/HandshakeModal';

export default function SellerDashboardScreen({ onNavigate }) {
  const { walletAddress, isAuthenticated } = useAuth();
  const { books, deleteBook, exportLedgerCsv } = useMarketplace();

  const [activeTab, setActiveTab] = useState('dashboard-overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHandshakeModalOpen, setIsHandshakeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Stats calculation
  const activeListingsCount = books.filter(b => b.status === 'Available').length;
  const escrowPendingBooks = books.filter(b => b.status === 'Escrow Pending');
  const escrowPendingTotal = escrowPendingBooks.reduce((sum, b) => sum + (b.priceInr || 0), 0);

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory === 'all') return true;
    if (filterCategory === 'escrow') return book.status === 'Escrow Pending';
    if (filterCategory === 'available') return book.status === 'Available';
    if (filterCategory === 'verified') return book.status === 'Sold & Verified';
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-surface">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'wallet-settings') {
            onNavigate('screen5');
          } else {
            setActiveTab(tab);
          }
        }}
        onAddTextbookClick={() => setIsAddModalOpen(true)}
        onHandshakeClick={() => setIsHandshakeModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {/* Top Seller Status Context Banner */}
          <div className="w-full bg-surface-container-high rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-surface-container-highest">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  alt="Seller Avatar"
                  className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-surface"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-primary">
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '0x71C8...392A'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-mono text-[10px] font-bold">
                    SIWE Verified
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant font-sans text-xs font-semibold shadow-2xs">
                    UC Berkeley • EECS
                  </span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  Undergraduate Peer Merchant • Reputation Score: <span className="font-bold text-emerald-700">99.4%</span> (23 Handshakes)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-2xs border border-surface-container-high">
              <span className="material-symbols-outlined text-secondary text-sm">hub</span>
              <span className="font-sans text-xs text-on-surface font-medium">
                Spring 2025 Semester Book Swap Active across 42 Campuses
              </span>
            </div>
          </div>

          {/* TAB 1: LEDGER OVERVIEW */}
          {activeTab === 'dashboard-overview' && (
            <>
              {/* Editorial Headline Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-secondary uppercase tracking-wider font-bold">
                    Decentralized Academic Ledger
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl text-primary font-bold mt-1">
                    Engineering Resale Portal
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                    Manage syllabus-validated peer inventory, monitor cryptographically locked escrow balances, and authenticate physical drop-offs via multi-sig handshake codes.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={exportLedgerCsv}
                    className="bg-surface-container-lowest hover:bg-surface-container text-on-surface font-sans text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-xs border border-outline-variant/30 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    <span>Export Ledger CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    <span>List Textbook</span>
                  </button>
                </div>
              </div>

              {/* Key Metrics Row (3-Column Asymmetric) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat 1: Active Listings */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Active Listings
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">auto_stories</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-on-surface">
                        {activeListingsCount}
                      </span>
                      <span className="font-sans text-xs text-on-surface-variant font-medium">Textbooks Available</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center text-emerald-700 font-sans text-xs font-bold">
                        <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> +2 this week
                      </span>
                      <span className="text-on-surface-variant font-sans text-xs">• 3 pending inspection</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                {/* Stat 2: Sold Books */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Sold Books
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-on-surface">19</span>
                      <span className="font-sans text-xs text-on-surface-variant font-medium">Volumes</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-secondary font-mono text-xs font-bold">₹1,18,000</span>
                      <span className="text-on-surface-variant font-sans text-xs">lifetime verified volume</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
                    <div className="bg-secondary-container h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Stat 3: Pending Payout */}
                <div className="bg-primary text-on-primary rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-primary-fixed uppercase tracking-wider">
                      Upcoming Disbursement
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-mono text-[10px] font-bold">
                      Epoch #48
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-surface-bright">
                        ₹{escrowPendingTotal.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-xs text-inverse-primary font-bold">INR</span>
                    </div>
                    <p className="font-sans text-xs text-surface-container-highest/80 mt-1">
                      {escrowPendingBooks.length} sales awaiting Friday on-chain settlement
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary-container">
                    <span className="font-mono text-[10px] text-primary-fixed">Contract Escrow Pool</span>
                    <span className="font-mono text-[10px] text-tertiary-fixed font-bold">100% Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Featured Focus Section: Pending Payout Breakdown Card */}
              <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-surface-container-high">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="font-display text-xl font-bold text-primary">Pending Payout Breakdown</h2>
                        <span className="px-3 py-0.5 rounded-full bg-surface-container-high text-emerald-800 font-sans text-xs font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          Escrow Confirmed - Scheduled for Auto-Transfer
                        </span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Kitaab Bazaar settles seller payouts at the end of each week after buyer confirms book condition code upon physical campus pickup.
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-6 justify-between shadow-2xs border border-surface-container-high">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Settlement Window</span>
                      <span className="font-sans text-xs font-bold text-on-surface">Friday, Feb 28, 2025</span>
                      <span className="font-mono text-[10px] text-on-surface-variant">23:59 UTC</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Net Total</span>
                      <div className="font-display text-lg font-extrabold text-primary">
                        ₹{escrowPendingTotal.toLocaleString('en-IN')} <span className="font-sans text-xs font-normal text-on-surface-variant">INR</span>
                      </div>
                      <span className="font-sans text-xs font-semibold text-emerald-700">
                        {escrowPendingBooks.length} Completed Deliveries
                      </span>
                    </div>
                  </div>
                </div>

                {/* Settlement Item Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                  {escrowPendingBooks.map(item => (
                    <div
                      key={item.id}
                      className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between shadow-2xs border border-surface-container-high hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[10px] font-bold">
                            {item.txId}
                          </span>
                          <span className="text-emerald-700 font-sans text-xs font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-sm">done_all</span> Buyer Verified
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold text-on-surface line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                          Buyer: {item.buyer}
                        </p>
                        <span className="font-mono text-[10px] text-primary font-bold mt-1 block">
                          Code: #{item.handshakeCode}
                        </span>
                      </div>
                      <div className="mt-4 pt-2 border-t border-surface-container-high flex items-center justify-between">
                        <span className="font-sans text-xs text-on-surface-variant">Net Payout</span>
                        <span className="font-display text-base font-bold text-primary">
                          ₹{(item.priceInr || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB 2: MY INVENTORY */}
          {(activeTab === 'my-listings' || activeTab === 'active-escrows' || activeTab === 'pickup-verification') && (
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-primary">
                    {activeTab === 'my-listings' && 'Textbook Inventory Management'}
                    {activeTab === 'active-escrows' && 'Active On-Chain Escrows'}
                    {activeTab === 'pickup-verification' && 'Campus Handshake Verification Desk'}
                  </h2>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    Live peer-to-peer textbook resale contracts tied to your SIWE session.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Search Bar */}
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-sm text-on-surface-variant">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search title or course..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>New Listing</span>
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`font-sans text-xs px-3 py-1 rounded-full font-bold transition-all ${
                    filterCategory === 'all'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  All ({books.length})
                </button>
                <button
                  onClick={() => setFilterCategory('escrow')}
                  className={`font-sans text-xs px-3 py-1 rounded-full font-bold transition-all ${
                    filterCategory === 'escrow'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Escrow Pending ({escrowPendingBooks.length})
                </button>
                <button
                  onClick={() => setFilterCategory('available')}
                  className={`font-sans text-xs px-3 py-1 rounded-full font-bold transition-all ${
                    filterCategory === 'available'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Available ({activeListingsCount})
                </button>
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map(book => (
                  <div
                    key={book.id}
                    className="bg-surface-container-low rounded-xl p-4 border border-surface-container-high flex flex-col justify-between hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-mono text-[10px] font-bold">
                          {book.courseCode}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            book.status === 'Escrow Pending'
                              ? 'bg-amber-100 text-amber-900'
                              : book.status === 'Sold & Verified'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          {book.status}
                        </span>
                      </div>

                      <h3 className="font-display text-sm font-bold text-on-surface line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                        {book.author} • {book.edition}
                      </p>
                      <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                        <span className="font-semibold">Condition:</span> {book.condition}
                      </p>

                      {book.handshakeCode && (
                        <div className="mt-2 p-2 rounded-lg bg-surface-container-lowest border border-surface-container-high">
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="text-on-surface-variant">Handshake Code:</span>
                            <span className="font-bold text-primary">#{book.handshakeCode}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
                      <div>
                        <span className="font-display text-base font-bold text-primary">
                          ₹{(book.priceInr || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant ml-1">INR</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {book.status === 'Escrow Pending' && (
                          <button
                            onClick={() => setIsHandshakeModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>Verify Code</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors"
                          title="Delete listing"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTextbookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <HandshakeModal
        isOpen={isHandshakeModalOpen}
        onClose={() => setIsHandshakeModalOpen(false)}
      />
    </div>
  );
}
