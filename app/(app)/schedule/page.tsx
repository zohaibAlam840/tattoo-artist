"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookingsForDateAction } from "@/app/actions/bookings";
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
  const [loading, setLoading] = useState(false);

  const selectedDate = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    getBookingsForDateAction(selectedDate).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, [selectedDate]);

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
                <BookingRow booking={slot.full} />
              ) : (
                <>
                  {slot.am  ? <BookingRow booking={slot.am}  /> : <EmptyRow label="Manhã — Disponível" />}
                  {slot.pm  ? <BookingRow booking={slot.pm}  /> : <EmptyRow label="Tarde — Disponível" />}
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

function BookingRow({ booking }: { booking: Booking }) {
  const c = TYPE_COLORS[booking.booking_type];
  const name = booking.profile?.full_name ?? "Unknown";
  const handle = booking.profile?.handle ?? "";
  return (
    <div className="flex items-center gap-3 px-4 py-3 mb-1 mx-2 rounded-xl" style={{ background: c.bg }}>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0" style={{ color: c.text }}>
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight" style={{ color: c.text }}>{name}</p>
        {handle && <p className="text-xs opacity-70" style={{ color: c.text }}>{handle}</p>}
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.2)", color: c.text }}>
        {c.label}
      </span>
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
