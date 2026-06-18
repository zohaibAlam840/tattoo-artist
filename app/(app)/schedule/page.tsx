"use client";
import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getBookingsForDateAction,
  deleteBookingAction,
  updateBookingStationAction,
} from "@/app/actions/bookings";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking, StationSlot } from "@/lib/types";

const DAYS = ["S", "T", "Q", "Q", "S", "S", "D"];
const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOffset(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7; }

const TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  full: { bg: "#3A4A3B", text: "#fff",     label: "Dia Inteiro" },
  am:   { bg: "#D4E8D6", text: "#2C2C2C",  label: "Manhã" },
  pm:   { bg: "#D4E0EA", text: "#2C2C2C",  label: "Tarde" },
};

function buildSlots(bookings: Booking[]): StationSlot[] {
  return [1, 2, 3, 4].map((station) => {
    const sb = bookings.filter((b) => b.station === station);
    return {
      station,
      full: sb.find((b) => b.booking_type === "full") ?? null,
      am:   sb.find((b) => b.booking_type === "am")   ?? null,
      pm:   sb.find((b) => b.booking_type === "pm")   ?? null,
    };
  });
}

export default function Schedule() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);
  const [loadedKey, setLoadedKey] = useState("");

  const selectedDate = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
  const loadKey = `${selectedDate}#${refreshTick}`;
  const loading = loadedKey !== loadKey;

  // Re-fetch after a delete / station move without changing the date.
  const reload = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    getBookingsForDateAction(selectedDate).then((data) => {
      if (!active) return;
      setBookings(data);
      setLoadedKey(`${selectedDate}#${refreshTick}`);
    });
    return () => { active = false; };
  }, [selectedDate, refreshTick]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(1);
  }

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const offset = getFirstDayOffset(viewYear, viewMonth);
  const slots = buildSlots(bookings);

  return (
    <main className="min-h-screen pb-4" style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}>
      <div className="px-5 pt-10 pb-4">
        <h1 className="text-3xl font-light text-center text-[#2C2C2C] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Agenda
        </h1>
        <div className="w-full h-px bg-[#D5CFC9]" />
      </div>

      {/* Calendar */}
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-semibold text-[#2C2C2C] text-base">{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <div className="flex gap-3">
            <button onClick={prevMonth} className="p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button onClick={nextMonth} className="p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 px-3 pb-1">
          {DAYS.map((d, i) => (
            <div key={i} className="text-center text-xs font-medium py-1" style={{ color: i === 1 ? "#2D7DD2" : "#999" }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
          {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const selected = d === selectedDay;
            return (
              <button key={d} onClick={() => setSelectedDay(d)}
                className="flex items-center justify-center h-9 w-9 mx-auto rounded-md text-sm font-medium"
                style={{
                  background: selected ? "#2D7DD2" : "transparent",
                  color: selected ? "#fff" : isToday(d) ? "#2D7DD2" : "#2C2C2C",
                  fontWeight: (selected || isToday(d)) ? 700 : 400,
                }}
              >{d}</button>
            );
          })}
        </div>
      </div>

      {/* New Booking */}
      <div className="px-4 mb-5">
        <Link href={`/schedule/new?date=${selectedDate}`}
          className="block w-full text-center text-white py-4 rounded-full text-base font-medium"
          style={{ background: "#3A4A3B" }}
        >
          Nova Reserva
        </Link>
      </div>

      {/* Station slots */}
      <div className="px-4 flex flex-col gap-3">
        {loading ? (
          <p className="text-sm text-center text-[#888] py-4">Loading…</p>
        ) : (
          slots.map((slot) => (
            <div key={slot.station} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs text-[#999] uppercase tracking-widest">Bancada {slot.station}</p>
              </div>
              {slot.full ? (
                <BookingRow booking={slot.full} onChange={reload} />
              ) : (
                <>
                  {slot.am  ? <BookingRow booking={slot.am}  onChange={reload} /> : <EmptyRow label="Manhã — Disponível" />}
                  {slot.pm  ? <BookingRow booking={slot.pm}  onChange={reload} /> : <EmptyRow label="Tarde — Disponível" />}
                </>
              )}
              {!slot.full && !slot.am && !slot.pm && null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function BookingRow({ booking, onChange }: { booking: Booking; onChange: () => void }) {
  const c = TYPE_COLORS[booking.booking_type];
  const name = booking.profile?.full_name ?? "Unknown";
  const handle = booking.profile?.handle ?? "";
  const avatarUrl = booking.profile?.avatar_url ?? null;

  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const isOwner = user?.id === booking.user_id;
  const canDelete = isAdmin || isOwner;

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Remover a reserva de ${name}?`)) return;
    setError("");
    startTransition(async () => {
      const res = await deleteBookingAction(booking.id);
      if (res?.error) setError(res.error);
      else onChange();
    });
  }

  function handleMove(station: number) {
    setError("");
    startTransition(async () => {
      const res = await updateBookingStationAction(booking.id, station);
      if (res?.error) setError(res.error);
      else { setEditing(false); onChange(); }
    });
  }

  return (
    <div className="mb-1 mx-2">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: c.bg }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0" style={{ color: c.text }}>
            {name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate" style={{ color: c.text }}>{name}</p>
          {handle && <p className="text-xs opacity-70 truncate" style={{ color: c.text }}>{handle}</p>}
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.2)", color: c.text }}>
          {c.label}
        </span>

        {canDelete && (
          <div className="flex items-center gap-1 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setEditing((e) => !e)}
                disabled={isPending}
                aria-label="Mudar bancada"
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
                style={{ background: "rgba(255,255,255,0.22)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke={c.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isPending}
              aria-label="Remover reserva"
              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
              style={{ background: "rgba(255,255,255,0.22)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke={c.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {editing && isAdmin && (
        <div className="flex items-center gap-2 flex-wrap px-3 pt-2">
          <span className="text-xs text-[#888]">Mover para:</span>
          {[1, 2, 3, 4].filter((s) => s !== booking.station).map((s) => (
            <button
              key={s}
              onClick={() => handleMove(s)}
              disabled={isPending}
              className="w-8 h-8 rounded-lg text-sm font-semibold bg-white border border-[#D5CFC9] text-[#2C2C2C] disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 px-3 pt-1">{error}</p>}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="px-4 py-2.5 mb-1 mx-2 rounded-xl border border-dashed border-[#D5CFC9] flex items-center">
      <span className="text-xs text-[#AAA]">{label}</span>
    </div>
  );
}
