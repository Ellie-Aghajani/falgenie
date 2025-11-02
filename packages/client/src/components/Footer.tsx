import { useEffect, useState } from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

export default function Footer() {
   const [visits, setVisits] = useState<number | null>(null);

   useEffect(() => {
      let cancelled = false;
      (async () => {
         try {
            await fetch('/api/visits', { method: 'POST' });
            const res = await fetch('/api/visits', { cache: 'no-store' });
            const data = await res.json();
            if (!cancelled) setVisits(data.visits);
         } catch {
            console.error('Failed to fetch visits');
         }
      })();
      return () => {
         cancelled = true;
      };
   }, []);

   return (
      <footer
         className="
        w-full border-t border-[#811979]/90
        bg-[#241726] text-white
      "
      >
         <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <a
               href="/"
               className="font-serif grenze-brand text-2xl tracking-wide text-[#811979] hover:text-amber-500 transition"
               aria-label="FalGenie Home"
            >
               FalGenie
            </a>

            <div className="flex items-center gap-5">
               <a
                  href="https://instagram.com/your-handle"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-[#811979] hover:text-amber-400 transition"
                  title="Instagram"
               >
                  <FaInstagram className="w-5 h-5" />
               </a>
               <a
                  href="https://www.tiktok.com/@your-handle"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="text-[#811979] hover:text-amber-400 transition"
                  title="TikTok"
               >
                  <SiTiktok className="w-5 h-5" />
               </a>
               <a
                  href="https://youtube.com/@your-handle"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="text-[#811979] hover:text-amber-400 transition"
                  title="YouTube"
               >
                  <FaYoutube className="w-5 h-5" />
               </a>
            </div>

            <div className="text-sm text-[#811979]">
               {visits === null
                  ? '—'
                  : `Total Views ${visits.toLocaleString()}`}
            </div>
         </div>
      </footer>
   );
}
