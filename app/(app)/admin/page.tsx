import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-1">
      <span className="text-xs text-[#888] uppercase tracking-widest">{label}</span>
      <span
        className="text-3xl font-light text-[#2C2C2C]"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  if (myProfile?.role !== "admin") redirect("/");

  const today = new Date().toLocaleDateString("en-CA");

  const [
    { count: residentCount },
    { count: guestCount },
    { data: todayBookings },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "resident"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "guest"),
    supabase.from("bookings").select("station, booking_type").eq("booking_date", today),
  ]);

  // Compute fully-booked stations
  const stationMap: Record<number, Set<string>> = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };
  for (const b of todayBookings ?? []) {
    stationMap[b.station]?.add(b.booking_type);
  }
  const fullyBooked = [1, 2, 3, 4].filter((s) => {
    const types = stationMap[s];
    return types.has("full") || (types.has("am") && types.has("pm"));
  });
  const freeCount = 4 - fullyBooked.length;

  return (
    <main
      className="min-h-screen px-5 pt-10 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <h1
          className="text-3xl font-light text-[#2C2C2C]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Admin
        </h1>
        <span
          className="text-xs px-3 py-1 rounded-full"
          style={{ background: "#3A4A3B", color: "#fff" }}
        >
          {myProfile?.full_name ?? "Admin"}
        </span>
      </div>
      <div className="w-full h-px bg-[#D5CFC9] mt-4 mb-6" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Resident Artists" value={residentCount ?? 0} />
        <StatCard label="Guest Artists" value={guestCount ?? 0} />
        <StatCard label="Today's Bookings" value={(todayBookings ?? []).length} />
        <StatCard label="Free Stations" value={freeCount} />
      </div>

      {/* Quick actions */}
      <p className="text-xs text-[#888] uppercase tracking-widest mb-3">Manage</p>
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/artists"
          className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm"
        >
          <div>
            <p className="font-medium text-sm text-[#2C2C2C]">Artists</p>
            <p className="text-xs text-[#888] mt-0.5">Manage roles &amp; assignments</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <Link
          href="/schedule"
          className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm"
        >
          <div>
            <p className="font-medium text-sm text-[#2C2C2C]">Schedule</p>
            <p className="text-xs text-[#888] mt-0.5">View &amp; reassign station bookings</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <Link
          href="/admin/artists/new"
          className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm"
        >
          <div>
            <p className="font-medium text-sm text-[#2C2C2C]">Add Artist</p>
            <p className="text-xs text-[#888] mt-0.5">Register a new resident or guest</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
