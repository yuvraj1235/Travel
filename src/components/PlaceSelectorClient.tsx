"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import PlacePhotosClient from "./PlacePhotosClient";

export default function PlaceSelectorClient({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  const [debounced, setDebounced] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), 500);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div>
      <div className="space-y-3">
        <Label htmlFor="destination" className="text-slate-700 dark:text-slate-200 font-bold">Destination</Label>
        <Input id="destination" name="destination" required value={value} onChange={(e: any) => setValue(e.target.value)} placeholder="e.g. Kyoto, Japan" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus-visible:ring-indigo-500 h-14 rounded-xl shadow-sm" />
      </div>

      <PlacePhotosClient place={debounced} />
    </div>
  );
}
