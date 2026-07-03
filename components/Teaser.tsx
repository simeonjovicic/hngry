"use client";

import { useEffect, useRef, useState } from "react";
import Countdown from "./Countdown";
import TeaserShader from "./TeaserShader";

type Status = "idle" | "checking" | "wrong" | "unlocking";

export default function Teaser() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [glitching, setGlitching] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // autoplay is usually blocked — retry on the first interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    const tryPlay = () => {
      if (audio.paused && soundOn) {
        audio.play().catch(() => {
          // still blocked — next interaction will retry
        });
      }
    };
    tryPlay();
    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("keydown", tryPlay);
    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, [soundOn]);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      audio.play().catch(() => {});
      setSoundOn(true);
    }
  };

  const handleGlitch = () => {
    setGlitching(true);
    if (glitchTimer.current) clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setGlitching(false), 240);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || status === "checking" || status === "unlocking") return;
    setStatus("checking");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setStatus("unlocking");
      audioRef.current?.pause();
    } else {
      setStatus("wrong");
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0d0d0c] text-bone">
      <TeaserShader
        unlocking={status === "unlocking"}
        onFlooded={() => window.location.reload()}
        onGlitch={handleGlitch}
      />

      <audio ref={audioRef} src="/audio/teaser.mp3" loop preload="auto" />

      {/* frame labels */}
      <div
        className={`pointer-events-none absolute inset-0 p-5 font-mono text-[10px] tracking-[0.3em] text-bone/60 sm:p-8 sm:text-[11px] ${
          glitching ? "dom-glitch" : ""
        }`}
      >
        <span className="animate-rise absolute left-5 top-5 sm:left-8 sm:top-8 [animation-delay:400ms]">
          HNGRŸ®
        </span>
        <span className="animate-rise absolute right-5 top-5 sm:right-8 sm:top-8 [animation-delay:550ms]">
          DROP 001 — SUMMER 26
        </span>
        <span className="animate-rise absolute bottom-5 left-5 sm:bottom-8 sm:left-8 [animation-delay:700ms]">
          20.07.2026 — 20:15
        </span>
        <span className="animate-rise absolute bottom-5 right-5 hidden sm:bottom-8 sm:right-8 sm:block [animation-delay:850ms]">
          STAY HNGRŸ
        </span>
      </div>

      {/* sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute right-5 top-14 z-10 font-mono text-[10px] tracking-[0.3em] text-bone/40 transition-colors hover:text-bone sm:right-8 sm:top-20"
      >
        SOUND {soundOn ? "ON" : "OFF"}
      </button>

      {/* countdown + gate */}
      <div
        className={`absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-8 px-6 transition-opacity duration-700 ${
          status === "unlocking" ? "pointer-events-none opacity-0" : ""
        } ${glitching ? "dom-glitch" : ""}`}
      >
        <div className="animate-rise [animation-delay:1100ms]">
          <Countdown />
        </div>

        <form
          onSubmit={submit}
          className={`animate-rise flex w-full max-w-xs items-end gap-3 [animation-delay:1350ms] ${
            status === "wrong" ? "animate-shake" : ""
          }`}
          onAnimationEnd={() => status === "wrong" && setStatus("idle")}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            autoComplete="off"
            className="w-full border-b border-bone/30 bg-transparent pb-2 text-center font-mono text-sm tracking-[0.4em] uppercase outline-none transition-colors placeholder:text-bone/25 focus:border-bone"
          />
          <button
            type="submit"
            aria-label="Enter"
            className="border-b border-bone/30 pb-2 font-mono text-sm tracking-widest transition-colors hover:border-bone hover:text-tag"
          >
            →
          </button>
        </form>

        <p
          className={`font-mono text-[10px] tracking-[0.3em] transition-opacity duration-300 ${
            status === "wrong" ? "text-tag opacity-100" : "opacity-0"
          }`}
        >
          WRONG. STAY HUNGRY.
        </p>
      </div>
    </div>
  );
}
