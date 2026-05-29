"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getBookingsForDateAction } from "@/app/actions/bookings";
import type { Booking } from "@/lib/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STATIONS = [
  { id: 1, cx: 130, cy: 510 },
  { id: 2, cx: 130, cy: 340 },
  { id: 3, cx: 495, cy: 340 },
  { id: 4, cx: 495, cy: 510 },
];
const SVG_W = 624.91;
const SVG_H = 1230.36;

const TYPE_LABELS: Record<string, string> = { full: "Dia Inteiro", am: "Manhã — Até 13h", pm: "Tarde — Após 13h" };

function addDays(date: Date, days: number) {
  const d = new Date(date); d.setDate(d.getDate() + days); return d;
}
function formatDate(date: Date) {
  return `${DAY_NAMES[date.getDay()]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}
function toDateString(d: Date) { return d.toLocaleDateString("en-CA"); }

function getPrimaryBooking(bookings: Booking[], station: number): Booking | null {
  const sb = bookings.filter((b) => b.station === station);
  return sb.find((b) => b.booking_type === "full") ?? sb.find((b) => b.booking_type === "am") ?? sb.find((b) => b.booking_type === "pm") ?? null;
}

function ArtistSheet({ booking, station, onClose }: { booking: Booking | null; station: number; onClose: () => void }) {
  const name = booking?.profile?.full_name ?? null;
  const handle = booking?.profile?.handle ?? null;
  const avatarUrl = booking?.profile?.avatar_url ?? null;
  const initial = name ? name[0].toUpperCase() : String(station);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-xl px-6 pt-5 pb-8"
        style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-[#D5CFC9] mx-auto mb-5" />

        <p className="text-xs text-[#888] uppercase tracking-widest mb-4">Bancada {station}</p>

        {booking && name ? (
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ background: "#3A4A3B", color: "#fff", fontFamily: "var(--font-cormorant)" }}
              >
                {initial}
              </div>
            )}
            <div>
              <p className="text-xl font-semibold text-[#2C2C2C]" style={{ fontFamily: "var(--font-cormorant)" }}>
                {name}
              </p>
              {handle && <p className="text-sm text-[#888]">{handle}</p>}
              <span
                className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full"
                style={{ background: "#3A4A3B", color: "#fff" }}
              >
                {TYPE_LABELS[booking.booking_type]}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 border-2 border-dashed"
              style={{ background: "#F0EDE9", borderColor: "#B5AFA9", color: "#AAA", fontFamily: "var(--font-cormorant)" }}
            >
              {station}
            </div>
            <div>
              <p className="text-xl font-semibold text-[#2C2C2C]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Disponível
              </p>
              <p className="text-sm text-[#AAA]">Sem reserva nesta data</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3.5 rounded-full text-sm font-medium"
          style={{ background: "#fff", color: "#2C2C2C", border: "1.5px solid #D5CFC9" }}
        >
          Fechar
        </button>
      </div>
    </>
  );
}

export default function MapPage() {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getBookingsForDateAction(toDateString(date)).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, [date]);

  const selectedBooking = selectedStation !== null ? getPrimaryBooking(bookings, selectedStation) : null;

  return (
    <main
      className="min-h-screen px-4 pt-10 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <h1
        className="text-3xl font-light text-center text-[#2C2C2C] mb-4"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Mapa do Estúdio
      </h1>
      <div className="w-full h-px bg-[#D5CFC9] mb-6" />

      {/* Date picker */}
      <div className="flex items-center justify-center gap-4 mb-5">
        <button onClick={() => setDate((d) => addDays(d, -1))} className="p-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#555" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2 border border-[#C8C2BB] rounded-xl px-5 py-3 bg-white">
          <span className="text-sm font-medium text-[#2C2C2C]">{formatDate(date)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#888" strokeWidth="1.5" />
            <path d="M3 9h18M8 2v4M16 2v4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <button onClick={() => setDate((d) => addDays(d, 1))} className="p-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="#555" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Floor plan */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: "196.9%" }}>
          <Image src="/floor-plan.svg" alt="Studio floor plan" fill className="object-contain" unoptimized />

          {STATIONS.map((s) => {
            const booking = loading ? null : getPrimaryBooking(bookings, s.id);
            const name = booking?.profile?.full_name ?? null;
            const avatarUrl = booking?.profile?.avatar_url ?? null;
            const pctX = (s.cx / SVG_W) * 100;
            const pctY = (s.cy / SVG_H) * 100;

            return (
              <button
                key={s.id}
                onClick={() => setSelectedStation(s.id)}
                className="absolute flex flex-col items-center"
                style={{ left: `${pctX}%`, top: `${pctY}%`, transform: "translate(-50%, -50%)" }}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name ?? ""}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border-2 shadow"
                    style={{ borderColor: "#3A4A3B" }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow"
                    style={{
                      background: name ? "#3A4A3B" : "#F0EDE9",
                      borderColor: name ? "#3A4A3B" : "#B5AFA9",
                      color: name ? "#fff" : "#777",
                      fontFamily: "var(--font-cormorant)",
                    }}
                  >
                    {name ? name[0].toUpperCase() : s.id}
                  </div>
                )}
                {name && (
                  <span
                    className="mt-0.5 px-1.5 py-0.5 rounded text-center"
                    style={{ background: "rgba(255,255,255,0.92)", fontSize: "7px", color: "#333", whiteSpace: "nowrap" }}
                  >
                    {name.split(" ")[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#3A4A3B" }} />
          <span className="text-xs text-[#888]">Ocupada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border" style={{ background: "#F0EDE9", borderColor: "#B5AFA9" }} />
          <span className="text-xs text-[#888]">Available</span>
        </div>
        <span className="text-xs text-[#BBB]">Toque em uma bancada para ver detalhes</span>
      </div>

      {/* Artist detail sheet */}
      {selectedStation !== null && (
        <ArtistSheet
          booking={selectedBooking}
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </main>
  );
}
