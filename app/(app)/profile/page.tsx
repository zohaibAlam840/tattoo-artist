"use client";
import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { logoutAction } from "@/app/actions/auth";

export default function Profile() {
  const { profile } = useAuth();
  const [isPending, startTransition] = useTransition();

  const name = profile?.full_name ?? "Artist";
  const handle = profile?.handle ?? "";
  const email = profile?.email ?? "";
  const initial = name[0]?.toUpperCase() ?? "?";

  function handleLogout() {
    startTransition(async () => { await logoutAction(); });
  }

  return (
    <main
      className="min-h-screen px-5 pt-14 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Avatar + info */}
      <div className="flex flex-col items-center mb-8">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover mb-4 shadow"
            unoptimized
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow"
            style={{ background: "#3A4A3B", color: "#fff", fontFamily: "var(--font-cormorant)" }}
          >
            {initial}
          </div>
        )}
        <h2
          className="text-2xl font-semibold text-[#2C2C2C]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {name}
        </h2>
        {handle && <p className="text-sm text-[#666] mt-0.5">{handle}</p>}
        {email && <p className="text-sm text-[#666]">{email}</p>}
        {profile?.role && (
          <span
            className="mt-2 text-xs px-3 py-1 rounded-full capitalize"
            style={{
              background: profile.role === "admin" ? "#3A4A3B" : profile.role === "guest" ? "#EAF3FB" : "#E8EDE8",
              color: profile.role === "admin" ? "#fff" : profile.role === "guest" ? "#2D7DD2" : "#3A4A3B",
            }}
          >
            {profile.role}
          </span>
        )}
        {profile?.preferred_station && (
          <p className="text-xs text-[#AAA] mt-1">Preferred station {profile.preferred_station}</p>
        )}
      </div>

      <div className="w-full h-px bg-[#D5CFC9] mb-6" />

      <div className="flex flex-col gap-3">
        <Link
          href="/profile/edit"
          className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#2C2C2C] text-sm font-medium">Editar Perfil</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#555" strokeWidth="1.5"/>
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-[#2C2C2C] text-sm font-medium">Preferências</span>
        </Link>

        {/* Mobile-only logout (desktop has TopNav logout) */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="md:hidden flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm w-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-medium" style={{ color: "#C0392B" }}>
            {isPending ? "Saindo…" : "Sair"}
          </span>
        </button>
      </div>
    </main>
  );
}
