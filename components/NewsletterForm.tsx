"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setStatus(res?.ok ? "done" : "error");
  };

  if (status === "done") {
    return (
      <p className="font-mono text-sm tracking-[0.25em]">
        YOU&apos;RE IN. STAY HNGRŸ. ✦
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-md items-end gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ENTER EMAIL ADDRESS"
        className="w-full border-b border-ink/40 bg-transparent pb-2 font-mono text-sm tracking-[0.2em] outline-none transition-colors placeholder:text-ink/30 focus:border-ink"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="border-b border-ink/40 pb-2 font-mono text-sm tracking-widest transition-colors hover:border-ink hover:text-tag disabled:opacity-40"
      >
        {status === "sending" ? "…" : "→"}
      </button>
      {status === "error" && (
        <span className="pb-2 font-mono text-[10px] tracking-widest text-tag">
          TRY AGAIN
        </span>
      )}
    </form>
  );
}
