"use client";
import { useState } from "react";
import { getBookingLinksForTrip } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";

export function BookingLinksClient({ destination, startDate, endDate }: { destination: string, startDate: string, endDate: string }) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await getBookingLinksForTrip(destination, startDate, endDate);
      setLinks(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setFetched(true);
  }

  if (!fetched && !loading) {
    return (
      <Button onClick={handleFetch} variant="outline" className="w-full mt-4 rounded-2xl border-indigo-500/50 text-indigo-500 dark:text-indigo-300 bg-white/70 dark:bg-slate-900/60 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15">
        Generate Booking Links with AI
      </Button>
    );
  }

  if (loading) {
    return <div className="text-slate-500 dark:text-slate-400 text-sm mt-4 text-center animate-pulse">Generating booking links...</div>;
  }

  if (links.length === 0) {
    return <div className="text-slate-500 dark:text-slate-400 text-sm mt-4 text-center">No links generated.</div>;
  }

  return (
    <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-5">
      <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 uppercase tracking-wider">Booking Links</h4>
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5">
            {link.type === 'Flight' ? '✈️' : link.type === 'Hotel' ? '🏨' : '🎟️'} 
            <span className="text-slate-700 dark:text-slate-200 font-medium">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
