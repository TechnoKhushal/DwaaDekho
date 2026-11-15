'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';
import { Cross, MapPin, Search } from 'lucide-react';

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  brand?: { name: string } | null;
  dosageForm?: { name: string } | null;
  category?: { name: string } | null;
  strength?: Array<{ amount: string; unit?: string | null }>;
};

type Pharmacy = {
  id: string;
  pharmacyName: string;
  address?: string | null;
  rating?: number | null;
  distanceKm: number;
  isOpen?: boolean;
  isJanAushadhi?: boolean;
};

type ApiResponse<T> = { success: boolean; data?: T; error?: { message?: string } };

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

async function apiGet<T>(path: string): Promise<T> {
  if (!apiBase) throw new Error('The API URL is not configured. Set NEXT_PUBLIC_API_URL in the frontend deployment.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  const body = await response.json() as ApiResponse<T>;
  if (!response.ok || !body.success || body.data === undefined) {
    throw new Error(body.error?.message || `The service returned HTTP ${response.status}.`);
  }
  return body.data;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [notice, setNotice] = useState('Search the live medicine catalogue or find verified pharmacies near your current location.');
  const [busy, setBusy] = useState(false);

  async function searchMedicines(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice('Loading catalogue…');
    try {
      const params = new URLSearchParams({ limit: '25' });
      if (query.trim()) params.set('q', query.trim());
      const results = await apiGet<Medicine[]>(`/api/v1/medicines?${params}`);
      setMedicines(results);
      setNotice(`${results.length} catalogue ${results.length === 1 ? 'item' : 'items'} found.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Catalogue search is unavailable. Try again later.');
      setMedicines([]);
    } finally {
      setBusy(false);
    }
  }

  async function findPharmacies() {
    if (!navigator.geolocation) {
      setNotice('Location search is not supported by this browser.');
      return;
    }
    setBusy(true);
    setNotice('Waiting for location permission…');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      setNotice('Finding nearby verified pharmacies…');
      try {
        const params = new URLSearchParams({ lat: String(coords.latitude), lng: String(coords.longitude), radius: '5' });
        const results = await apiGet<Pharmacy[]>(`/api/v1/pharmacies/nearby?${params}`);
        setPharmacies(results);
        setNotice(`${results.length} verified ${results.length === 1 ? 'pharmacy' : 'pharmacies'} found within 5 km.`);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Pharmacy search is unavailable. Try again later.');
        setPharmacies([]);
      } finally {
        setBusy(false);
      }
    }, (error) => {
      setBusy(false);
      setNotice(error.code === error.PERMISSION_DENIED ? 'Location access was declined. You can allow it in browser settings and try again.' : 'Could not determine your location. Try again when location is available.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="DwaaDekho home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-800 text-white"><Cross className="h-5 w-5" /></span>
            <span><span className="block text-lg font-bold tracking-tight">dwaadekho.</span><span className="block text-[10px] font-semibold tracking-[0.2em] text-slate-500">CARE, CLOSER</span></span>
          </Link>
          <span className="text-sm text-slate-500">Medicine and pharmacy directory</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">Healthcare, made easier to navigate</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Find medicines and pharmacies near you.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Search the connected medicine catalogue or locate verified pharmacies using your device location.</p>
        </section>

        <section className="mt-9 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <form onSubmit={searchMedicines} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">Search medicines</h2>
            <label htmlFor="medicine-query" className="mt-4 block text-sm font-medium text-slate-700">Medicine or generic name</label>
            <div className="mt-2 flex gap-2">
              <input id="medicine-query" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={100} placeholder="For example, paracetamol" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100" />
              <button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60"><Search className="h-4 w-4" /><span className="hidden sm:inline">Search</span></button>
            </div>
            <div className="mt-5 space-y-3">
              {medicines.map((medicine) => <article key={medicine.id} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold">{medicine.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{medicine.genericName}{medicine.strength?.length ? ` · ${medicine.strength.map((item) => `${item.amount} ${item.unit ?? ''}`.trim()).join(', ')}` : ''}{medicine.dosageForm?.name ? ` · ${medicine.dosageForm.name}` : ''}</p>
                {medicine.brand?.name && <p className="mt-1 text-xs text-slate-500">Brand: {medicine.brand.name}</p>}
              </article>)}
            </div>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-semibold">Nearby pharmacies</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Your browser will ask before sharing location. Coordinates are used to request pharmacies within 5 km.</p>
            <button type="button" onClick={findPharmacies} disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-teal-800 px-4 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50 disabled:opacity-60"><MapPin className="h-4 w-4" />Find pharmacies near me</button>
            <div className="mt-5 space-y-3">
              {pharmacies.map((pharmacy) => <article key={pharmacy.id} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold">{pharmacy.pharmacyName}</h3>
                {pharmacy.address && <p className="mt-1 text-sm text-slate-600">{pharmacy.address}</p>}
                <p className="mt-2 text-xs text-slate-500">{pharmacy.distanceKm.toFixed(1)} km away{pharmacy.rating ? ` · ${pharmacy.rating.toFixed(1)} rating` : ''}{pharmacy.isOpen ? ' · Open' : ''}{pharmacy.isJanAushadhi ? ' · Jan Aushadhi' : ''}</p>
              </article>)}
            </div>
          </section>
        </section>

        <p role="status" aria-live="polite" className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">{notice}</p>
        <p className="mt-4 text-xs leading-5 text-slate-500">Catalogue and pharmacy availability depend on configured services and verified records. This site does not provide medical advice, confirm stock, or place orders.</p>
      </div>
    </main>
  );
}
