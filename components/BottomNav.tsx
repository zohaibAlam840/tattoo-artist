"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? "#2C2C2C" : "#999";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
        fill={active ? c : "none"} stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function ScheduleIcon({ active }: { active: boolean }) {
  const c = active ? "#2C2C2C" : "#999";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="1.5" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="7" y="13" width="2" height="2" fill={c} />
      <rect x="11" y="13" width="2" height="2" fill={c} />
      <rect x="15" y="13" width="2" height="2" fill={c} />
      <rect x="7" y="17" width="2" height="2" fill={c} />
      <rect x="11" y="17" width="2" height="2" fill={c} />
    </svg>
  );
}
function MapIcon({ active }: { active: boolean }) {
  const c = active ? "#2C2C2C" : "#999";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 3v15M15 6v15" stroke={c} strokeWidth="1.5" />
    </svg>
  );
}
function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? "#2C2C2C" : "#999";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function AdminIcon({ active }: { active: boolean }) {
  const c = active ? "#2C2C2C" : "#999";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
        stroke={c} strokeWidth="1.5" strokeLinejoin="round"
        fill={active ? c : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M9 12l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const baseItems = [
  { href: "/", label: "Início", Icon: HomeIcon },
  { href: "/schedule", label: "Agenda", Icon: ScheduleIcon },
  { href: "/map", label: "Mapa", Icon: MapIcon },
  { href: "/profile", label: "Perfil", Icon: ProfileIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const navItems = isAdmin
    ? [...baseItems, { href: "/admin", label: "Admin", Icon: AdminIcon }]
    : baseItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-[#D5CFC9] z-50"
      style={{ height: "64px", background: "#EAE5DF" }}
    >
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 flex-1">
              <Icon active={active} />
              <span style={{ fontSize: "10px", color: active ? "#2C2C2C" : "#999", fontFamily: "var(--font-dm-sans)" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
