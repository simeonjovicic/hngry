const MESSAGES = [
  "STAY HNGRŸ",
  "FREE SHIPPING OVER €80",
  "DROP 001 — OUT NOW",
  "TOO FLYYY FOR A 9–5",
  "WORLDWIDE SHIPPING",
];

export default function Ticker() {
  const line = MESSAGES.map((m) => `${m}   ✦   `).join("");
  return (
    <div className="flex h-8 items-center overflow-hidden bg-ink text-bone">
      <div className="animate-ticker flex w-max whitespace-nowrap font-mono text-[11px] tracking-[0.2em]">
        <span>{line}</span>
        <span aria-hidden>{line}</span>
      </div>
    </div>
  );
}
