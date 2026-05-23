"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { updateOwnProfileAction } from "@/app/actions/users";

export default function Settings() {
  const { profile, refreshProfile } = useAuth();
  const [station, setStation] = useState("1");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (profile?.preferred_station) {
      setStation(String(profile.preferred_station));
    }
  }, [profile]);

  function handleSave() {
    setSaved(false);
    setError("");
    startTransition(async () => {
      const res = await updateOwnProfileAction({ preferred_station: Number(station) });
      if (res?.error) setError(res.error);
      else {
        await refreshProfile();
        setSaved(true);
      }
    });
  }

  return (
    <main
      className="min-h-screen px-5 pt-6 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <button
        onClick={() => router.back()}
        className="text-[#2C2C2C] mb-8"
        aria-label="Go back"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1
        className="text-3xl font-light text-center text-[#2C2C2C] mb-6"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Your Preferences
      </h1>

      <div className="w-full h-px bg-[#D5CFC9] mb-8" />

      <div className="flex items-center justify-between mb-8">
        <label className="text-sm text-[#555]">Station Preference</label>
        <div className="relative">
          <select
            value={station}
            onChange={(e) => { setStation(e.target.value); setSaved(false); }}
            className="appearance-none bg-white border border-[#D5CFC9] rounded-xl px-4 py-3 pr-10 text-[#2C2C2C] text-sm w-40"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={String(n)}>Station {n}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 text-center mb-4">{error}</p>}
      {saved && <p className="text-xs text-center mb-4" style={{ color: "#3A4A3B" }}>Preferences saved.</p>}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full text-white py-4 rounded-full text-base font-medium disabled:opacity-60"
        style={{ background: "#3A4A3B" }}
      >
        {isPending ? "Saving…" : "Save Changes"}
      </button>
    </main>
  );
}
