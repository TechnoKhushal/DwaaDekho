import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Pill, Stethoscope, ScanLine, MapPin, AlarmClock, HeartPulse,
  IndianRupee, ShieldCheck, TrendingDown, ChevronDown, Star, Plus, Minus,
  ShoppingCart, CheckCircle2, X, Camera, Upload, Phone, Navigation,
  Clock, Sparkles, Package, BadgeCheck, AlertTriangle, Loader2
} from 'lucide-react';

const API = '/api';

/* ------------------------- Sample Pharmacy Data ------------------------- */
const PHARMACIES = [
  { id: 'p1', name: 'Jan Aushadhi Kendra - Sector 18', distance: 0.4, address: 'Shop 12, Market Complex, Sector 18', open: true, rating: 4.9, generic: true },
  { id: 'p2', name: 'Apollo Pharmacy - Main Road', distance: 0.9, address: 'Plot 4, Main Road, Near City Hospital', open: true, rating: 4.7, generic: false },
  { id: 'p3', name: 'MedPlus - Gandhi Nagar', distance: 1.3, address: '2nd Floor, Shree Complex, Gandhi Nagar', open: false, rating: 4.6, generic: false },
  { id: 'p4', name: 'Wellness Forever - Central Market', distance: 1.8, address: 'Central Market, Bus Stand Road', open: true, rating: 4.8, generic: true }
];

/* ------------------------- Sample Prescriptions ------------------------- */
const PRESCRIPTIONS = [
  {
    id: 'rx1',
    doctor: 'Dr. R. Sharma (MBBS, MD - General Physician)',
    hospital: 'City Care Hospital',
    date: '05 Nov 2026',
    items: [
      { name: 'Augmentin 625 Duo Tablet', dosage: '1 tablet twice daily', duration: '5 days', qty: 10 },
      { name: 'Dolo 650 Tablet', dosage: '1 tablet as needed for fever', duration: '3 days', qty: 6 },
      { name: 'Pantocid 40mg Tablet', dosage: '1 tablet before breakfast', duration: '7 days', qty: 7 }
    ]
  }
];

/* ------------------------- Cart State ------------------------- */
const CART_INITIAL = [
  { id: 'med-1', qty: 10 },
  { id: 'med-2', qty: 6 }
];

/* ------------------------- Pill Reminders ------------------------- */
const REMINDERS_INITIAL = [
  { id: 'r1', medicine: 'Thyronorm 50mcg', time: '07:00', note: 'Empty stomach - 30 min before breakfast', taken: false },
  { id: 'r2', medicine: 'Telma 40mg', time: '20:30', note: 'After dinner', taken: false }
];

/* ------------------------- Utility ------------------------- */
const formatINR = (n) => `₹${Number(n).toFixed(2)}`;
const todayStr = () => new Date().toISOString().split('T')[0];

/* ------------------------- Components ------------------------- */
function Header({ onCart }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-lg text-slate-900 tracking-tight">DwaaDekho</span>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Smart medicine & generic savings</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <a href="#search" className="px-3 py-2 rounded-lg hover:bg-slate-100 transition">Find Medicine</a>
          <a href="#pharmacy" className="px-3 py-2 rounded-lg hover:bg-slate-100 transition">Pharmacies</a>
          <a href="#reminder" className="px-3 py-2 rounded-lg hover:bg-slate-100 transition">Reminders</a>
        </nav>
        <button onClick={onCart} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition shadow-sm">
          <ShoppingCart className="w-4 h-4" /> Cart <span className="bg-white/20 rounded-full px-1.5 text-xs">2</span>
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const stats = [
    { icon: Sparkles, label: 'Generic Savings', value: 'Up to 90%' },
    { icon: BadgeCheck, label: 'WHO-GMP Certified', value: 'Jan Aushadhi' },
    { icon: ShieldCheck, label: 'Quality Checked', value: 'IP Standard' }
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3.5 py-1.5 text-xs font-medium mb-5 border border-white/15">
              <HeartPulse className="w-3.5 h-3.5 text-teal-200" />
              India's friendly medicine discovery platform
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
              Find your medicine.<br />
              <span className="text-teal-200">Save up to 90%</span> with generics.
            </h1>
            <p className="text-teal-50/90 text-base lg:text-lg mb-8 max-w-lg">
              DwaaDekho helps you search medicines, discover trusted Jan Aushadhi generic equivalents,
              compare prices, and get doorstep delivery — all in one simple place.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#search" className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition shadow-lg">
                <Search className="w-4 h-4" /> Search Medicines
              </a>
              <a href="#scanner" className="inline-flex items-center gap-2 bg-teal-500/40 border border-teal-300/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-500/60 transition">
                <ScanLine className="w-4 h-4" /> Scan Prescription
              </a>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-1 gap-4">
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-teal-100">Live generic price comparison</span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-300"><TrendingDown className="w-3.5 h-3.5" /> 86% avg saving</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💊</span>
                    <div><p className="text-sm font-medium">Pantocid 40</p><p className="text-xs text-teal-200/70">Brand price</p></div>
                  </div>
                  <span className="text-sm font-bold">{formatINR(178.5)}</span>
                </div>
                <div className="flex items-center justify-between bg-emerald-400/20 border border-emerald-300/20 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💊</span>
                    <div><p className="text-sm font-medium">Generic equivalent</p><p className="text-xs text-emerald-200">Jan Aushadhi · 86% off</p></div>
                  </div>
                  <span className="text-sm font-bold text-emerald-200">{formatINR(24)}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 border border-white/15 rounded-xl p-3.5 text-center">
                  <s.icon className="w-5 h-5 mx-auto mb-1.5 text-teal-200" />
                  <p className="text-sm font-bold leading-tight">{s.value}</p>
                  <p className="text-[10px] text-teal-100/80 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MedicineCard({ med, cartQty, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="p-5 flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={med.image} alt={med.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 leading-snug">{med.name}</h3>
            {med.requiresPrescription && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0">
                <Stethoscope className="w-3 h-3" /> Rx
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{med.genericName}</p>
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            <span className="inline-flex items-center text-amber-500 font-semibold"><Star className="w-3.5 h-3.5 fill-amber-400" /> {med.rating}</span>
            <span className="text-slate-400">({med.reviewsCount.toLocaleString()} reviews)</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle2 className="w-3 h-3" /> In stock</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1">
            <p className="text-xs text-slate-400 line-through">{formatINR(med.mrp)}</p>
            <p className="text-xl font-bold text-slate-900">{formatINR(med.price)} <span className="text-xs font-semibold text-emerald-600">({Math.round((1 - med.price / med.mrp) * 100)}% off)</span></p>
          </div>
          {cartQty > 0 ? (
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-2 py-1.5">
              <button onClick={onRemove} className="w-7 h-7 rounded-lg bg-white border border-teal-200 flex items-center justify-center text-teal-700 hover:bg-teal-100 transition"><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-sm font-bold text-teal-800 w-5 text-center">{cartQty}</span>
              <button onClick={onAdd} className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button onClick={onAdd} className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-teal-700 transition">
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition">
          {expanded ? 'Hide details' : 'View details'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-sm space-y-3">
            <p className="text-slate-600 text-xs leading-relaxed">{med.description}</p>
            <div>
              <p className="font-semibold text-xs text-slate-700 mb-1">Common uses</p>
              <ul className="space-y-0.5 text-xs text-slate-500 list-disc pl-4">
                {med.uses.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
            {med.genericSubstitute && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" /> Generic substitute available</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 rounded-full px-2 py-0.5">{med.genericSubstitute.savingsPercent}% savings</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium">{med.genericSubstitute.name}</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  <span className="line-through opacity-70">{formatINR(med.genericSubstitute.mrp)}</span>{' '}
                  <span className="font-bold">{formatINR(med.genericSubstitute.price)}</span>
                  <span className="opacity-80"> · {med.genericSubstitute.manufacturer}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [cart, setCart] = useState(CART_INITIAL);

  const cartMap = useMemo(() => Object.fromEntries(cart.map((c) => [c.id, c.qty])), [cart]);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/medicines${query ? `?q=${encodeURIComponent(query)}` : ''}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchMedicines, 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    let list = [...results];
    if (category !== 'All') list = list.filter((m) => m.category === category);
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'savings') list.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    else list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    return list;
  }, [results, category, sortBy]);

  const categories = ['All', ...new Set(results.map((m) => m.category))];

  const addToCart = (id) => setCart((prev) => {
    const existing = prev.find((c) => c.id === id);
    return existing ? prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { id, qty: 1 }];
  });
  const removeFromCart = (id) => setCart((prev) => prev.flatMap((c) => c.id === id ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c]));

  return (
    <section id="search" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-16">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-3">
          <Pill className="w-3.5 h-3.5" /> Medicine Search
        </span>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">What medicine are you looking for?</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">Search by brand name, salt, or symptom. We'll show you the cheapest verified generic equivalent.</p>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'Dolo 650', 'paracetamol', or 'fever'..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${category === c ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Sort:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/40">
            <option value="popularity">Most popular</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="savings">Biggest savings</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-teal-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No medicines match "{query}". Try a different search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((med) => (
            <MedicineCard key={med.id} med={med} cartQty={cartMap[med.id] || 0}
              onAdd={() => addToCart(med.id)} onRemove={() => removeFromCart(med.id)} />
          ))}
        </div>
      )}
    </section>
  );
}

function GenericSaver() {
  const [selected, setSelected] = useState('med-3');
  const [qty, setQty] = useState(30);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetch(`${API}/medicines`).then((r) => r.json()).then(setMedicines).catch(console.error);
  }, []);

  const med = medicines.find((m) => m.id === selected) || medicines[0];
  if (!med) return null;
  const brandTotal = med.price * qty;
  const genericTotal = med.genericSubstitute.price * qty;
  const savings = brandTotal - genericTotal;
  const savingsPct = med.genericSubstitute.savingsPercent;

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 bg-teal-500/10 border border-teal-400/30 rounded-full px-3 py-1 mb-3">
            <TrendingDown className="w-3.5 h-3.5" /> Generic Savings Calculator
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold">How much could you save?</h2>
          <p className="text-slate-300 mt-2 max-w-xl mx-auto text-sm">Compare brand vs. Jan Aushadhi generic prices and see your real savings on a monthly course.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-300 mb-3">1. Choose a medicine</p>
              <select value={selected} onChange={(e) => setSelected(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50">
                {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-300 mb-3">2. Quantity (tablets per month)</p>
              <input type="range" min="10" max="120" step="10" value={qty} onChange={(e) => setQty(Number(e.target.value))}
                className="w-full accent-teal-400" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10</span><span className="text-teal-300 font-bold">{qty} tablets</span><span>120</span></div>
            </div>
          </div>

          <div className="bg-white/5 border border-teal-400/20 rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">Brand medicine ({med.brand})</span>
              <span className="text-sm font-bold">{formatINR(brandTotal)}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">Generic substitute</span>
              <span className="text-sm font-bold text-teal-300">{formatINR(genericTotal)}</span>
            </div>
            <div className="border-t border-white/10 my-3" />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">You save</span>
              <span className="text-2xl font-bold text-emerald-400">{formatINR(savings)} <span className="text-sm">({savingsPct}% off)</span></span>
            </div>
            <p className="text-xs text-slate-400 mt-3">Same salt, same strength, same IP quality — just without the brand markup.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrescriptionScanner() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setDone(false); }
  };

  const scan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setDone(true); }, 1800);
  };

  return (
    <section id="scanner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-16">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-3">
            <ScanLine className="w-3.5 h-3.5" /> Smart Prescription Scan
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">Upload your prescription</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Just photograph your doctor's prescription and DwaaDekho will read it, match each medicine to its
            lowest-priced verified generic, and prepare your cart automatically. No typing, no confusion.
          </p>
          <div className="space-y-3">
            {['Reads medicine names & dosages automatically', 'Finds generic equivalents for every item', 'Builds a price-optimized cart in seconds'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-sm text-slate-700">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setDone(false); } }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${done ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'}`}>
            <input id="rx-upload" type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
            <label htmlFor="rx-upload" className="cursor-pointer block">
              {done ? (
                <>
                  <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
                  <p className="text-sm font-semibold text-emerald-700">Prescription scanned!</p>
                  <p className="text-xs text-emerald-600 mt-1">3 medicines matched to generics</p>
                </>
              ) : scanning ? (
                <>
                  <Loader2 className="w-12 h-12 mx-auto text-teal-600 animate-spin mb-3" />
                  <p className="text-sm font-semibold text-teal-700">Reading prescription...</p>
                  <p className="text-xs text-slate-400 mt-1">Identifying medicines & dosages</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                    {file ? <Camera className="w-6 h-6 text-teal-600" /> : <Upload className="w-6 h-6 text-teal-600" />}
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{file ? file.name : 'Drop your prescription here'}</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse · JPG, PNG, PDF up to 10MB</p>
                </>
              )}
            </label>
          </div>
          {!done && (
            <button onClick={scan} disabled={!file || scanning}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${file && !scanning ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
              <ScanLine className="w-4 h-4" /> {scanning ? 'Scanning...' : 'Scan Prescription'}
            </button>
          )}
          {done && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-800 mb-2">Auto-matched items</p>
              {PRESCRIPTIONS[0].items.map((it) => (
                <div key={it.name} className="flex items-center justify-between py-1.5 border-b border-emerald-100 last:border-0 text-xs">
                  <span className="text-slate-700 font-medium">{it.name}</span>
                  <span className="text-emerald-700 font-bold">Generic · save up to 85%</span>
                </div>
              ))}
              <button className="mt-3 w-full bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-emerald-700 transition">
                Add all to cart & checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PharmacyFinder() {
  const [location, setLocation] = useState('Sector 18');
  const [searchLoc, setSearchLoc] = useState('Sector 18');

  const sorted = [...PHARMACIES].sort((a, b) => a.distance - b.distance);

  return (
    <section id="pharmacy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-16">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-3">
          <MapPin className="w-3.5 h-3.5" /> Pharmacy Locator
        </span>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Pharmacies near you</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">Find trusted stores, Jan Aushadhi Kendras, and 24/7 options closest to you.</p>
      </div>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input value={location} onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearchLoc(location)}
            placeholder="Enter your area, pincode, or landmark..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 text-sm" />
          <button onClick={() => setSearchLoc(location)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-teal-700 transition">
            <Navigation className="w-4 h-4 inline -mt-0.5 mr-1" /> Locate
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">Showing results near <span className="font-semibold text-slate-600">{searchLoc}</span></p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {sorted.map((p) => (
          <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4 ${p.generic ? 'border-emerald-200' : 'border-slate-100'}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${p.generic ? 'bg-emerald-50 text-emerald-600' : 'bg-teal-50 text-teal-600'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm text-slate-900 truncate">{p.name}</h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 shrink-0 ${p.open ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${p.open ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {p.open ? 'Open now' : 'Closed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{p.address}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-slate-600 font-semibold">{p.distance} km away</span>
                <span className="inline-flex items-center text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating}</span>
              </div>
              {p.generic && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 mt-2"><BadgeCheck className="w-3 h-3" /> Jan Aushadhi · Generic store</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PillReminder() {
  const [reminders, setReminders] = useState(REMINDERS_INITIAL);
  const [newMed, setNewMed] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  const toggleTaken = (id) => setReminders((prev) => prev.map((r) => r.id === id ? { ...r, taken: !r.taken } : r));
  const addReminder = () => {
    if (!newMed.trim()) return;
    setReminders((prev) => [...prev, { id: `r${Date.now()}`, medicine: newMed.trim(), time: newTime, note: 'Custom reminder', taken: false }]);
    setNewMed('');
  };
  const removeReminder = (id) => setReminders((prev) => prev.filter((r) => r.id !== id));

  return (
    <section id="reminder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-16">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1 mb-3">
          <AlarmClock className="w-3.5 h-3.5" /> Pill Reminders
        </span>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Never miss a dose</h2>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">Set gentle reminders for your daily medication schedule. Mark them taken as you go.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-5">
          <input value={newMed} onChange={(e) => setNewMed(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addReminder()}
            placeholder="Medicine name (e.g. Dolo 650)" className="flex-1 min-w-40 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40" />
          <button onClick={addReminder} className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-teal-700 transition"><Plus className="w-4 h-4" /> Add</button>
        </div>

        <div className="space-y-2.5">
          {reminders.map((r) => (
            <div key={r.id} className={`flex items-center gap-3 p-3.5 rounded-xl border transition ${r.taken ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
              <button onClick={() => toggleTaken(r.id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition shrink-0 ${r.taken ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-teal-400'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${r.taken ? 'text-emerald-700 line-through' : 'text-slate-800'}`}>{r.medicine}</p>
                <p className="text-xs text-slate-500">{r.note}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shrink-0">
                <Clock className="w-3 h-3 text-teal-600" /> {r.time}
              </span>
              <button onClick={() => removeReminder(r.id)} className="text-slate-300 hover:text-rose-500 transition shrink-0"><X className="w-4 h-4" /></button>
            </div>
          ))}
          {reminders.length === 0 && <p className="text-center text-sm text-slate-400 py-6">No reminders yet. Add your first one above.</p>}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{reminders.filter((r) => r.taken).length}/{reminders.length} doses taken today</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${reminders.length ? (reminders.filter((r) => r.taken).length / reminders.length) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CartDrawer({ open, onClose }) {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState(CART_INITIAL);

  useEffect(() => {
    fetch(`${API}/medicines`).then((r) => r.json()).then(setMedicines).catch(console.error);
  }, []);

  const items = cart.map((c) => {
    const med = medicines.find((m) => m.id === c.id);
    return med ? { ...med, qty: c.qty } : null;
  }).filter(Boolean);

  const brandTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const genericTotal = items.reduce((s, i) => s + (i.genericSubstitute?.price ?? i.price) * i.qty, 0);
  const savings = brandTotal - genericTotal;

  const updateQty = (id, delta) => setCart((prev) => prev.flatMap((c) => c.id === id ? (c.qty + delta > 0 ? [{ ...c, qty: c.qty + delta }] : []) : [c]));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-teal-600" /> Your Cart</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Your cart is empty.<br />Add some medicines to get started.</p>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{i.name}</p>
                  <p className="text-xs text-slate-500 truncate">{i.genericName}</p>
                </div>
                <p className="text-sm font-bold text-slate-900 shrink-0">{formatINR(i.price * i.qty)}</p>
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-1.5 py-1">
                  <button onClick={() => updateQty(i.id, -1)} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100"><Minus className="w-3 h-3" /></button>
                  <span className="text-xs font-bold w-5 text-center">{i.qty}</span>
                  <button onClick={() => updateQty(i.id, 1)} className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100"><Plus className="w-3 h-3" /></button>
                </div>
                {i.genericSubstitute && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">Generic saves {i.genericSubstitute.savingsPercent}%</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600"><span>Brand cart total</span><span className="line-through">{formatINR(brandTotal)}</span></div>
              <div className="flex justify-between text-slate-600"><span>With generic substitutes</span><span className="font-bold text-emerald-600">{formatINR(genericTotal)}</span></div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-100 pt-2"><span>You save</span><span className="text-emerald-600">{formatINR(savings)}</span></div>
            </div>
            <button className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 transition text-sm">
              Proceed to Checkout · {formatINR(genericTotal)}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center"><Pill className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white">DwaaDekho</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">Making quality medicines accessible and affordable for every Indian family through generic transparency.</p>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#search" className="hover:text-teal-300 transition">Find Medicine</a></li>
            <li><a href="#pharmacy" className="hover:text-teal-300 transition">Pharmacy Locator</a></li>
            <li><a href="#scanner" className="hover:text-teal-300 transition">Prescription Scan</a></li>
            <li><a href="#reminder" className="hover:text-teal-300 transition">Pill Reminders</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-3">Support</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 1800-180-8080 (Toll Free)</li>
            <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Report adverse event</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} DwaaDekho. Made with care for healthy India. Medicines shown are for informational purposes; always consult a doctor.
      </div>
    </footer>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      <Header onCart={() => setCartOpen(true)} />
      <Hero />
      <SearchSection />
      <GenericSaver />
      <PrescriptionScanner />
      <PharmacyFinder />
      <PillReminder />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
