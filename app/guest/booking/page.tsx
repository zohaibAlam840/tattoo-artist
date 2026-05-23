"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestStep2() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [station, setStation] = useState<number | null>(null);

  const valid = startDate && endDate && station;

  return (
    <main
      className="min-h-screen px-5 pt-6 pb-8"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Back */}
      <button onClick={() => router.back()} className="mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Step indicator */}
      <div className="flex gap-1.5 mb-6">
        <div className="h-1 flex-1 rounded-full" style={{ background: "#3A4A3B" }} />
        <div className="h-1 flex-1 rounded-full" style={{ background: "#3A4A3B" }} />
        <div className="h-1 flex-1 rounded-full" style={{ background: "#D5CFC9" }} />
      </div>

      <h1
        className="text-3xl font-light text-[#2C2C2C] mb-1"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Booking Details
      </h1>
      <p className="text-sm text-[#888] mb-8">Step 2 of 3 — Dates &amp; station</p>

      {/* Date range */}
      <div className="mb-8">
        <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Stay Period</p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
            />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
            />
          </div>
        </div>
      </div>

      {/* Station preference */}
      <div className="mb-8">
        <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Preferred Station</p>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setStation(n)}
              className="rounded-2xl py-5 flex items-center justify-center text-xl font-semibold"
              style={{
                background: station === n ? "#3A4A3B" : "#fff",
                color: station === n ? "#fff" : "#2C2C2C",
                fontFamily: "var(--font-cormorant)",
                border: "1.5px solid",
                borderColor: station === n ? "#3A4A3B" : "#D5CFC9",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={() => router.push("/guest/confirm")}
        className="w-full text-white py-4 rounded-full text-base font-medium disabled:opacity-40"
        style={{ background: "#3A4A3B" }}
      >
        Continue
      </button>
    </main>
  );
}
