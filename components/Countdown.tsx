"use client";

import { useEffect, useState } from "react";
import { DROP_DATE_ISO } from "@/lib/access";

const UNITS = ["DAYS", "HRS", "MIN", "SEC"] as const;

function diffParts(): [string, string, string, string] {
  const ms = Math.max(0, new Date(DROP_DATE_ISO).getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    pad(Math.floor(s / 86400)),
    pad(Math.floor((s % 86400) / 3600)),
    pad(Math.floor((s % 3600) / 60)),
    pad(s % 60),
  ];
}

export default function Countdown() {
  // rendered server-side as placeholders to avoid hydration mismatch
  const [parts, setParts] = useState<[string, string, string, string] | null>(null);

  useEffect(() => {
    setParts(diffParts());
    const id = setInterval(() => setParts(diffParts()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-start gap-6 sm:gap-10">
      {UNITS.map((unit, i) => (
        <div key={unit} className="flex flex-col items-center gap-2">
          <span className="font-display text-4xl tabular-nums sm:text-6xl">
            {parts ? parts[i] : "––"}
          </span>
          <span className="font-mono text-[10px] tracking-[0.35em] text-bone/40">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
