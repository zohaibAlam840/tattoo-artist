"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserAction } from "@/app/actions/users";

export default function AddArtist() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", handle: "", email: "", password: "", role: "resident",
    stationPref: "1", startDate: "", endDate: "",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const isGuest = form.role === "guest";
  const valid = form.name.trim() && form.handle.trim() && form.email.trim() && form.password.length >= 6 &&
    (!isGuest || (form.startDate && form.endDate));

  function handleSave() {
    setError("");
    startTransition(async () => {
      const res = await createUserAction({
        email: form.email,
        password: form.password,
        full_name: form.name,
        handle: form.handle,
        role: form.role as "resident" | "guest",
        preferred_station: Number(form.stationPref),
        guest_start: isGuest ? form.startDate : undefined,
        guest_end: isGuest ? form.endDate : undefined,
      });
      if (res?.error) setError(res.error);
      else router.push("/admin/artists");
    });
  }

  return (
    <main
      className="min-h-screen px-5 pt-6 pb-8"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/artists">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1
          className="text-3xl font-light text-[#2C2C2C]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Add Artist
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Role selector */}
        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">Role</label>
          <div className="grid grid-cols-2 gap-2">
            {["resident", "guest"].map((r) => (
              <button
                key={r}
                onClick={() => setForm((f) => ({ ...f, role: r }))}
                className="py-3 rounded-2xl text-sm font-medium capitalize transition-all"
                style={{
                  background: form.role === r ? "#3A4A3B" : "#fff",
                  color: form.role === r ? "#fff" : "#2C2C2C",
                  border: "1.5px solid",
                  borderColor: form.role === r ? "#3A4A3B" : "#D5CFC9",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Basic info */}
        {[
          { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Leah Vickers" },
          { label: "Instagram Handle", field: "handle", type: "text", placeholder: "@handle" },
          { label: "Email", field: "email", type: "email", placeholder: "artist@email.com" },
          { label: "Temporary Password", field: "password", type: "password", placeholder: "min. 6 characters" },
        ].map(({ label, field, type, placeholder }) => (
          <div key={field}>
            <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">{label}</label>
            <input
              type={type}
              value={form[field as keyof typeof form]}
              onChange={set(field)}
              placeholder={placeholder}
              className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
            />
          </div>
        ))}

        {/* Station preference */}
        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">
            Station Preference
          </label>
          <div className="relative">
            <select
              value={form.stationPref}
              onChange={set("stationPref")}
              className="appearance-none w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 pr-10 text-sm text-[#2C2C2C] outline-none"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={String(n)}>Station {n}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Guest-only: date range */}
        {isGuest && (
          <>
            <div>
              <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">
                Booking Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={set("startDate")}
                className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">
                Booking End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={set("endDate")}
                className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
              />
            </div>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500 text-center mt-4">{error}</p>}

      <button
        disabled={!valid || isPending}
        onClick={handleSave}
        className="w-full text-white py-4 rounded-full text-base font-medium mt-8 disabled:opacity-40"
        style={{ background: "#3A4A3B" }}
      >
        {isPending ? "Creating…" : "Save Artist"}
      </button>
    </main>
  );
}
