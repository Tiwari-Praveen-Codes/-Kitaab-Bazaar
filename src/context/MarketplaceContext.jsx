import React, { createContext, useContext, useState } from 'react';

const MarketplaceContext = createContext(null);

const INITIAL_BOOKS = [
  {
    id: "kb-bk-1",
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest, Stein",
    edition: "4th Edition (MIT Press)",
    courseCode: "CS 170 / CS 61B",
    campus: "IIT Bombay / UC Berkeley",
    department: "EECS",
    condition: "Like New (Annotated with Midterm Hints)",
    priceInr: 6800,
    priceEth: 0.032,
    status: "Escrow Pending",
    txId: "TX #8021",
    buyer: "Stanford (CS Dept)",
    handshakeCode: "CLRS-992",
    handshakeVerified: true,
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e37072?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-18",
  },
  {
    id: "kb-bk-2",
    title: "Signals and Systems",
    author: "Alan V. Oppenheim, Alan S. Willsky",
    edition: "2nd Edition (Prentice Hall)",
    courseCode: "EECS 120",
    campus: "IIT Delhi / UC Berkeley",
    department: "EECS",
    condition: "Very Good (Light Highlighting)",
    priceInr: 5400,
    priceEth: 0.025,
    status: "Escrow Pending",
    txId: "TX #8044",
    buyer: "UC Berkeley (EECS)",
    handshakeCode: "O&W-331",
    handshakeVerified: true,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-19",
  },
  {
    id: "kb-bk-3",
    title: "Operating System Concepts (Dinosaur Book)",
    author: "Silberschatz, Galvin, Gagne",
    edition: "10th Edition",
    courseCode: "CS 162",
    campus: "BITS Pilani / UC Berkeley",
    department: "Computer Science",
    condition: "Good",
    priceInr: 6100,
    priceEth: 0.029,
    status: "Escrow Pending",
    txId: "TX #8068",
    buyer: "CMU (SCS)",
    handshakeCode: "OS-1629",
    handshakeVerified: true,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-20",
  },
  {
    id: "kb-bk-4",
    title: "Microelectronic Circuits",
    author: "Adel S. Sedra, Kenneth C. Smith",
    edition: "8th Edition (Oxford Univ Press)",
    courseCode: "EECS 105",
    campus: "IIT Madras / UC Berkeley",
    department: "EECS",
    condition: "Excellent (Includes Formula Sheet)",
    priceInr: 5250,
    priceEth: 0.024,
    status: "Escrow Pending",
    txId: "TX #8092",
    buyer: "MIT (EECS)",
    handshakeCode: "MIC-448",
    handshakeVerified: true,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-21",
  },
  {
    id: "kb-bk-5",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    edition: "4th Edition (Global)",
    courseCode: "CS 188",
    campus: "IISc Bangalore / UC Berkeley",
    department: "Computer Science",
    condition: "Like New",
    priceInr: 7400,
    priceEth: 0.035,
    status: "Available",
    txId: null,
    buyer: null,
    handshakeCode: null,
    handshakeVerified: false,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-22",
  },
  {
    id: "kb-bk-6",
    title: "Computer Systems: A Programmer's Perspective (CS:APP)",
    author: "Randal E. Bryant, David R. O'Hallaron",
    edition: "3rd Edition",
    courseCode: "CS 61C",
    campus: "IIIT Hyderabad / UC Berkeley",
    department: "EECS",
    condition: "Annotated with Lab Solutions",
    priceInr: 6500,
    priceEth: 0.030,
    status: "Available",
    txId: null,
    buyer: null,
    handshakeCode: null,
    handshakeVerified: false,
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-23",
  },
  {
    id: "kb-bk-7",
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth H. Rosen",
    edition: "8th Edition (McGraw-Hill)",
    courseCode: "CS 70 / Math 55",
    campus: "IIT Kharagpur / UC Berkeley",
    department: "Mathematics",
    condition: "Good",
    priceInr: 4600,
    priceEth: 0.021,
    status: "Available",
    txId: null,
    buyer: null,
    handshakeCode: null,
    handshakeVerified: false,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    listedDate: "2025-02-24",
  }
];

export function MarketplaceProvider({ children }) {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 3500) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const addBook = (newBook) => {
    const book = {
      ...newBook,
      id: `kb-bk-${Date.now()}`,
      priceInr: Number(newBook.priceInr) || 0,
      status: 'Available',
      txId: null,
      buyer: null,
      handshakeCode: null,
      handshakeVerified: false,
      listedDate: new Date().toISOString().split('T')[0],
      image: newBook.image || "https://images.unsplash.com/photo-1532012164546-f432f2e37072?auto=format&fit=crop&w=600&q=80"
    };
    setBooks(prev => [book, ...prev]);
    showToast(`"${book.title}" listed successfully on campus ledger for ₹${book.priceInr.toLocaleString('en-IN')}!`, 'success');
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast("Listing removed from decentralized catalog.", 'info');
  };

  const buyBookEscrow = (bookId, buyerCampus = "Stanford CS / Student Node") => {
    const code = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const txNum = `TX #${Math.floor(8100 + Math.random() * 900)}`;
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          status: "Escrow Pending",
          txId: txNum,
          buyer: buyerCampus,
          handshakeCode: code,
          handshakeVerified: false
        };
      }
      return b;
    }));
    showToast(`Escrow created! ${txNum} locked on-chain. Handshake Code: #${code}`, 'success', 5000);
    return { txId: txNum, handshakeCode: code };
  };

  const verifyHandshake = (code) => {
    const cleanCode = code.replace('#', '').trim().toUpperCase();
    const matchedBook = books.find(b => b.handshakeCode && b.handshakeCode.toUpperCase() === cleanCode);
    
    if (matchedBook) {
      setBooks(prev => prev.map(b => {
        if (b.id === matchedBook.id) {
          return {
            ...b,
            status: "Sold & Verified",
            handshakeVerified: true
          };
        }
        return b;
      }));
      showToast(`Handshake code #${cleanCode} verified! Payout of ₹${matchedBook.priceInr.toLocaleString('en-IN')} released to seller wallet.`, 'success', 4000);
      return { success: true, book: matchedBook };
    } else {
      showToast(`Invalid handshake code "${code}". Please check the physical ticket.`, 'error');
      return { success: false, error: "Handshake code not found or already redeemed." };
    }
  };

  // Export CSV
  const exportLedgerCsv = () => {
    const headers = ["ID", "Title", "Author", "Edition", "Course", "Campus", "Price (INR)", "Status", "TX ID", "Handshake Code"];
    const rows = books.map(b => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.edition.replace(/"/g, '""')}"`,
      b.courseCode,
      b.campus,
      `"₹${(b.priceInr || 0).toLocaleString('en-IN')}"`,
      b.status,
      b.txId || "N/A",
      b.handshakeCode || "N/A"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kitaab_bazaar_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Ledger CSV (INR) exported to your device.", 'success');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        books,
        toast,
        showToast,
        addBook,
        deleteBook,
        buyBookEscrow,
        verifyHandshake,
        exportLedgerCsv
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return context;
}
