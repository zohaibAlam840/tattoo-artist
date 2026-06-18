"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Monogram from "./Monogram";
import Wordmark from "./Wordmark";
import { useAuth } from "@/contexts/AuthContext";
import { logoutAction } from "@/app/actions/auth";
import { useTransition } from "react";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/schedule", label: "Agenda" },
  { href: "/map", label: "Mapa" },
  { href: "/profile", label: "Perfil" },
];

export default function TopNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => { await logoutAction(); });
  }

  return (
    <header
      className="hidden md:flex items-center justify-between px-8 border-b border-[#D5CFC9] shrink-0"
      style={{ height: "64px", background: "#EAE5DF" }}
    >
      <Link href="/" className="flex items-center gap-3">
        <Monogram size={86} />
        <Wordmark width={150} />
      </Link>

      <nav className="flex items-center gap-1">
        {navItems.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ background: active ? "#3A4A3B" : "transparent", color: active ? "#fff" : "#555" }}
            >
              {label}
            </Link>
          );
        })}
        {profile?.role === "admin" && (
          <Link href="/admin"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              background: pathname.startsWith("/admin") ? "#3A4A3B" : "transparent",
              color: pathname.startsWith("/admin") ? "#fff" : "#555",
            }}
          >
            Admin
          </Link>
        )}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="ml-4 px-4 py-2 rounded-xl text-sm font-medium border border-[#D5CFC9] text-[#555] hover:border-[#3A4A3B] hover:text-[#3A4A3B] transition-colors disabled:opacity-50"
        >
          {isPending ? "…" : "Sair"}
        </button>
      </nav>
    </header>
  );
}
