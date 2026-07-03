"use client";

// temp: dev-only helper to jump back to the locked teaser — remove before launch
export default function TempLock() {
  const lock = async () => {
    await fetch("/api/unlock", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <button
      onClick={lock}
      className="fixed bottom-4 left-4 z-[95] border border-ink/30 bg-bone px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-ink/60 transition-colors hover:border-ink hover:text-ink"
    >
      🔒 LOCK (TEMP)
    </button>
  );
}
