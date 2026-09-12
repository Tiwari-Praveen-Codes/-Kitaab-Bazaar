import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function AddTextbookModal({ isOpen, onClose }) {
  const { addBook } = useMarketplace();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    edition: '1st Edition',
    courseCode: '',
    campus: 'UC Berkeley',
    department: 'EECS',
    condition: 'Like New',
    priceInr: '',
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e37072?auto=format&fit=crop&w=600&q=80',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.courseCode || !formData.priceInr) {
      alert("Please fill in the title, course code, and price in Rupees.");
      return;
    }

    const price = parseFloat(formData.priceInr) || 0;
    addBook({
      ...formData,
      priceInr: price,
      priceEth: Number((price / 250000).toFixed(4)),
    });

    onClose();
    setFormData({
      title: '',
      author: '',
      edition: '1st Edition',
      courseCode: '',
      campus: 'UC Berkeley',
      department: 'EECS',
      condition: 'Like New',
      priceInr: '',
      image: 'https://images.unsplash.com/photo-1532012164546-f432f2e37072?auto=format&fit=crop&w=600&q=80',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm transition-all duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl p-space-md sm:p-space-lg flex flex-col max-h-[90vh] overflow-y-auto border border-surface-container-high animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-lg">add_circle</span>
            </div>
            <div>
              <h2 className="font-display text-headline-sm text-on-surface font-bold">List Engineering Textbook</h2>
              <p className="font-sans text-[11px] text-on-surface-variant">Peer-to-peer campus escrow resale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
              Textbook Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Introduction to Algorithms (CLRS)"
              className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Author(s)
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Cormen, Leiserson"
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                placeholder="e.g. CS 170 / EECS 16B"
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Campus / University
              </label>
              <select
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="UC Berkeley">UC Berkeley</option>
                <option value="Stanford University">Stanford University</option>
                <option value="MIT">MIT</option>
                <option value="CMU">CMU</option>
                <option value="UIUC">UIUC</option>
                <option value="Caltech">Caltech</option>
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Like New">Like New (Pristine)</option>
                <option value="Annotated with Notes">Annotated with Exam Notes</option>
                <option value="Very Good">Very Good (Light Wear)</option>
                <option value="Good">Good (Readable, Intact)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Price (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-xs text-on-surface-variant">₹</span>
                <input
                  type="number"
                  step="50"
                  required
                  value={formData.priceInr}
                  onChange={(e) => setFormData({ ...formData, priceInr: e.target.value })}
                  placeholder="2500"
                  className="w-full pl-7 p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block font-sans text-xs font-semibold text-on-surface mb-1">
                Edition
              </label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                placeholder="4th Edition"
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-sans text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">shield_lock</span>
            <p className="font-mono text-[10px] text-on-surface-variant">
              Buyer payment will be held in smart contract escrow until you hand over the book on campus and verify the handshake code.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-sans text-xs text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary font-sans text-xs font-bold rounded-lg shadow-sm"
            >
              Confirm Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
