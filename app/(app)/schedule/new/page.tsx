"use client";
import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  checkAvailabilityAction,
  getFreeStationsAction,
  createBookingAction,
  reassignAndBookAction,
} from "@/app/actions/bookings";
import type { BookingType, Booking } from "@/lib/types";

const BOOKING_TYPES: { id: BookingType; label: string; desc: string }[] = [
  { id: "full", label: "Full Day", desc: "All day" },
  { id: "am",   label: "Half Day AM", desc: "Until 1:00 PM" },
  { id: "pm",   label: "Half Day PM", desc: "After 1:00 PM" },
];

function NewBookingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") ?? new Date().toLocaleDateString("en-CA");
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [station, setStation] = useState<number | null>(
    isAdmin && profile?.preferred_station ? profile.preferred_station : null
  );
  const [bookingType, setBookingType] = useState<BookingType>("full");
  const [checking, setChecking] = useState(false);
  const [conflicts, setConflicts] = useState<Booking[] | null>(null);
  const [freeStations, setFreeStations] = useState<number[]>([]);
  const [reassignTo, setReassignTo] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Reset conflict state when selection changes
  useEffect(() => {
    setConflicts(null);
    setFreeStations([]);
    setReassignTo(null);
    setError("");
  }, [station, bookingType]);

  // Pre-select preferred station for admin on first load
  useEffect(() => {
    if (isAdmin && profile?.preferred_station && station === null) {
      setStation(profile.preferred_station);
    }
  }, [isAdmin, profile?.preferred_station, station]);

  async function handleConfirm() {
    if (!station) return;
    setError("");
    setChecking(true);

    const { available, conflicts: c } = await checkAvailabilityAction(station, dateParam, bookingType);
    setChecking(false);

    if (available) {
      startTransition(async () => {
        const res = await createBookingAction({
          station,
          booking_date: dateParam,
          booking_type: bookingType,
        });
        if (res?.error) setError(res.error);
        else router.push("/schedule");
      });
      return;
    }

    setConflicts(c);

    if (isAdmin) {
      const free = await getFreeStationsAction(dateParam, bookingType, station);
      setFreeStations(free);
    }
  }

  async function handleReassign() {
    if (!station || !reassignTo || !conflicts?.length) return;
    startTransition(async () => {
      const res = await reassignAndBookAction({
        conflict_booking_id: conflicts[0].id,
        new_station_for_evictee: reassignTo,
        admin_station: station,
        booking_date: dateParam,
        booking_type: bookingType,
      });
      if (res?.error) setError(res.error);
      else router.push("/schedule");
    });
  }

  const showConflict = conflicts !== null && conflicts.length > 0;
  const conflictBooking = conflicts?.[0];

  const formattedDate = new Date(dateParam + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main
      className="min-h-screen px-5 pt-6 pb-8"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <button onClick={() => router.back()} className="mb-8" aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1
        className="text-3xl font-light text-[#2C2C2C] mb-1"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        New Booking
      </h1>
      <p className="text-sm text-[#888] mb-8">{formattedDate}</p>

      {/* Station select */}
      <div className="mb-8">
        <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Select Station</p>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setStation(n)}
              className="rounded-2xl py-5 flex items-center justify-center text-xl font-semibold transition-all"
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
        {isAdmin && profile?.preferred_station && (
          <p className="text-xs text-[#AAA] mt-2">
            Your preferred station is {profile.preferred_station}
          </p>
        )}
      </div>

      {/* Booking type */}
      <div className="mb-8">
        <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Booking Type</p>
        <div className="flex flex-col gap-2">
          {BOOKING_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setBookingType(t.id)}
              className="flex items-center justify-between rounded-2xl px-5 py-4 transition-all"
              style={{
                background: bookingType === t.id ? "#3A4A3B" : "#fff",
                color: bookingType === t.id ? "#fff" : "#2C2C2C",
                border: "1.5px solid",
                borderColor: bookingType === t.id ? "#3A4A3B" : "#D5CFC9",
              }}
            >
              <span className="font-medium text-sm">{t.label}</span>
              <span
                className="text-xs"
                style={{ color: bookingType === t.id ? "rgba(255,255,255,0.7)" : "#999" }}
              >
                {t.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conflict alert */}
      {showConflict && (
        <div
          className="mb-6 rounded-2xl overflow-hidden"
          style={{ background: "#FFF3F3", border: "1.5px solid #F5C0C0" }}
        >
          <div className="px-4 pt-4 pb-3">
            <p className="text-sm font-semibold mb-1" style={{ color: "#C0392B" }}>
              Station {station} is taken
            </p>
            {conflictBooking && (
              <p className="text-xs text-[#888]">
                {conflictBooking.profile?.full_name ?? "Someone"} has a{" "}
                {conflictBooking.booking_type === "full" ? "full day" :
                  conflictBooking.booking_type === "am" ? "morning" : "afternoon"} booking.
              </p>
            )}
          </div>

          {isAdmin ? (
            <div className="px-4 pb-4">
              {freeStations.length > 0 ? (
                <>
                  <p className="text-xs text-[#888] uppercase tracking-widest mb-2">
                    Move them to
                  </p>
                  <div className="flex gap-2 mb-3">
                    {freeStations.map((s) => (
                      <button
                        key={s}
                        onClick={() => setReassignTo(s)}
                        className="w-12 h-12 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: reassignTo === s ? "#3A4A3B" : "#fff",
                          color: reassignTo === s ? "#fff" : "#2C2C2C",
                          border: "1.5px solid",
                          borderColor: reassignTo === s ? "#3A4A3B" : "#D5CFC9",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!reassignTo || isPending}
                    onClick={handleReassign}
                    className="w-full py-3 rounded-2xl text-sm font-medium transition-all disabled:opacity-40"
                    style={{ background: "#C0392B", color: "#fff" }}
                  >
                    {isPending
                      ? "Reassigning…"
                      : `Move them to Station ${reassignTo ?? "?"} & take Station ${station}`}
                  </button>
                </>
              ) : (
                <p className="text-xs text-[#888]">
                  No free stations available for this booking type.
                </p>
              )}
            </div>
          ) : (
            <div className="px-4 pb-4">
              <p className="text-xs text-[#888] mb-3">Please select a different station.</p>
              <button
                onClick={() => setConflicts(null)}
                className="w-full py-3 rounded-2xl text-sm font-medium"
                style={{ background: "#fff", color: "#2C2C2C", border: "1.5px solid #D5CFC9" }}
              >
                ← Pick a different station
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 text-center mb-4">{error}</p>
      )}

      {!showConflict && (
        <button
          disabled={!station || checking || isPending}
          onClick={handleConfirm}
          className="w-full text-white py-4 rounded-full text-base font-medium disabled:opacity-40 transition-opacity"
          style={{ background: "#3A4A3B" }}
        >
          {checking || isPending ? "Checking…" : "Confirm Booking"}
        </button>
      )}
    </main>
  );
}

export default function NewBooking() {
  return (
    <Suspense>
      <NewBookingInner />
    </Suspense>
  );
}
