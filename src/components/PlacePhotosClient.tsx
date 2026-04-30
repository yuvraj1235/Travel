"use client";
import { useEffect, useState } from "react";

export default function PlacePhotosClient({ place }: { place: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!place) {
      setImages([]);
      return;
    }

    let cancelled = false;

    async function fetchImages(query: string) {
      setLoading(true);
      try {
        // 1) Search for a page title matching the place
        const sres = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            query
          )}&format=json&origin=*`
        );
        const sjson = await sres.json();
        const first = sjson?.query?.search?.[0]?.title;
        if (!first) return setImages([]);

        // 2) Get images listed on that page
        const ires = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            first
          )}&prop=images&format=json&origin=*`
        );
        const ijson = await ires.json();
        const pages = ijson?.query?.pages || {};
        const imageTitles: string[] = [];
        for (const pid of Object.keys(pages)) {
          const imgs = pages[pid].images || [];
          imgs.forEach((im: any) => {
            if (im && im.title && /\.(jpg|jpeg|png)$/i.test(im.title)) imageTitles.push(im.title);
          });
        }

        // 3) Resolve file URLs (take up to 6)
        const urls: string[] = [];
        for (const t of imageTitles.slice(0, 6)) {
          const infoRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
              t
            )}&prop=imageinfo&iiprop=url&format=json&origin=*`
          );
          const infoJson = await infoRes.json();
          const infoPages = infoJson?.query?.pages || {};
          for (const k of Object.keys(infoPages)) {
            const ii = infoPages[k].imageinfo?.[0];
            if (ii?.url) urls.push(ii.url);
          }
        }

        if (!cancelled) setImages(urls);
      } catch (err) {
        console.error("PlacePhotos fetch error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchImages(place);

    return () => {
      cancelled = true;
    };
  }, [place]);

  if (!place) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Photos from {place}</h4>
      {loading && <p className="text-xs text-slate-500">Loading photos…</p>}
      {!loading && images.length === 0 && <p className="text-xs text-slate-500">No photos found.</p>}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {images.map((src) => (
          <img key={src} src={src} alt={place} className="w-full h-24 object-cover rounded-md shadow-sm" />
        ))}
      </div>
    </div>
  );
}
