"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateUserAction, addGuestPeriodAction } from "@/app/actions/users";
import type { Profile, GuestPeriod, Role } from "@/lib/types";

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className="text-xs px-2.5 py-0.5 rounded-full capitalize"
      style={{
        background: role === "guest" ? "#EAF3FB" : role === "admin" ? "#3A4A3B" : "#E8EDE8",
        color: role === "guest" ? "#2D7DD2" : role === "admin" ? "#fff" : "#3A4A3B",
      }}
    >
      {role}
    </span>
  );
}

export default function ArtistEditForm({
  profile,
  periods,
}: {
  profile: Profile;
  periods: GuestPeriod[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    handle: profile.handle ?? "",
    role: profile.role as Role,
    preferred_station: profile.preferred_station ? String(profile.preferred_station) : "1",
  });
  const [formError, setFormError] = useState("");
  const [formSaved, setFormSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Add period form
  const [newPeriod, setNewPeriod] = useState({ start_date: "", end_date: "" });
  const [periodError, setPeriodError] = useState("");
  const [isPeriodPending, startPeriodTransition] = useTransition();

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const setPeriodField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPeriod((p) => ({ ...p, [field]: e.target.value }));

  function handleSave() {
    setFormError("");
    setFormSaved(false);
    startTransition(async () => {
      const res = await updateUserAction(profile.id, {
        full_name: form.full_name,
        handle: form.handle,
        role: form.role,
        preferred_station: Number(form.preferred_station) || null,
      });
      if (res?.error) setFormError(res.error);
      else setFormSaved(true);
    });
  }

  function handleAddPeriod() {
    if (!newPeriod.start_date || !newPeriod.end_date) return;
    setPeriodError("");
    startPeriodTransition(async () => {
      const res = await addGuestPeriodAction({
        user_id: profile.id,
        start_date: newPeriod.start_date,
        end_date: newPeriod.end_date,
      });
      if (res?.error) setPeriodError(res.error);
      else {
        setNewPeriod({ start_date: "", end_date: "" });
        router.refresh();
      }
    });
  }

  const initial = (form.full_name[0] ?? "?").toUpperCase();

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
        <div className="flex items-center gap-2">
          <h1
            className="text-3xl font-light text-[#2C2C2C]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Editar Artista
          </h1>
          <RoleBadge role={form.role} />
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "#3A4A3B", color: "#fff", fontFamily: "var(--font-cormorant)" }}
        >
          {initial}
        </div>
      </div>

      {/* Profile form */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">Função</label>
          <div className="grid grid-cols-3 gap-2">
            {(["resident", "guest", "admin"] as Role[]).map((r) => (
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

        {[
          { label: "Nome Completo", field: "full_name" },
          { label: "Instagram", field: "handle" },
        ].map(({ label, field }) => (
          <div key={field}>
            <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">{label}</label>
            <input
              type="text"
              value={form[field as keyof typeof form]}
              onChange={set(field)}
              className="w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">Bancada Preferida</label>
          <div className="relative">
            <select
              value={form.preferred_station}
              onChange={set("preferred_station")}
              className="appearance-none w-full bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 pr-10 text-sm text-[#2C2C2C] outline-none"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={String(n)}>Bancada {n}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#888] mb-1.5 uppercase tracking-widest">Email</label>
          <div className="bg-white border border-[#D5CFC9] rounded-2xl px-4 py-3.5 text-sm text-[#AAA]">
            {profile.email}
          </div>
        </div>
      </div>

      {formError && <p className="text-xs text-red-500 text-center mb-3">{formError}</p>}
      {formSaved && <p className="text-xs text-center mb-3" style={{ color: "#3A4A3B" }}>Profile saved.</p>}

      <button
        disabled={isPending || !form.full_name.trim()}
        onClick={handleSave}
        className="w-full text-white py-4 rounded-full text-base font-medium mb-8 disabled:opacity-40"
        style={{ background: "#3A4A3B" }}
      >
        {isPending ? "Salvando…" : "Salvar Alterações"}
      </button>

      {/* Guest periods */}
      {(form.role === "guest" || periods.length > 0) && (
        <>
          <div className="w-full h-px bg-[#D5CFC9] mb-6" />
          <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Períodos de Reserva</p>

          {periods.length === 0 && (
            <p className="text-sm text-[#AAA] mb-4">Nenhum período de reserva ainda.</p>
          )}

          {periods.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl px-4 py-3 mb-2 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-[#2C2C2C] font-medium">
                  {p.start_date} → {p.end_date}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#AAA" strokeWidth="1.5" />
                <path d="M3 9h18M8 2v4M16 2v4" stroke="#AAA" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          ))}

          <div className="mt-4 bg-white rounded-2xl px-4 py-4 shadow-sm">
            <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Adicionar Novo Período</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-[#888] mb-1">Start</label>
                <input
                  type="date"
                  value={newPeriod.start_date}
                  onChange={setPeriodField("start_date")}
                  className="w-full bg-[#F8F7F5] border border-[#D5CFC9] rounded-xl px-3 py-2.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#888] mb-1">End</label>
                <input
                  type="date"
                  value={newPeriod.end_date}
                  min={newPeriod.start_date}
                  onChange={setPeriodField("end_date")}
                  className="w-full bg-[#F8F7F5] border border-[#D5CFC9] rounded-xl px-3 py-2.5 text-sm text-[#2C2C2C] outline-none focus:border-[#3A4A3B]"
                />
              </div>
              {periodError && <p className="text-xs text-red-500">{periodError}</p>}
              <button
                disabled={!newPeriod.start_date || !newPeriod.end_date || isPeriodPending}
                onClick={handleAddPeriod}
                className="w-full py-3 rounded-2xl text-sm font-medium disabled:opacity-40"
                style={{ background: "#3A4A3B", color: "#fff" }}
              >
                {isPeriodPending ? "Adicionando…" : "Adicionar Período"}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
