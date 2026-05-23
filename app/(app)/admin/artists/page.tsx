import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminSupabase } from "@/lib/supabase/admin";
import type { Profile, GuestPeriod } from "@/lib/types";

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

export default async function ArtistsList() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "admin") redirect("/");

  const { data: profiles } = await adminSupabase
    .from("profiles")
    .select("*")
    .order("role")
    .order("full_name");

  // Fetch latest guest period for each guest
  const guestIds = (profiles ?? []).filter((p: Profile) => p.role === "guest").map((p: Profile) => p.id);
  let latestPeriods: Record<string, GuestPeriod> = {};

  if (guestIds.length > 0) {
    const { data: periods } = await adminSupabase
      .from("guest_periods")
      .select("*")
      .in("user_id", guestIds)
      .order("end_date", { ascending: false });

    for (const period of periods ?? []) {
      if (!latestPeriods[period.user_id]) {
        latestPeriods[period.user_id] = period;
      }
    }
  }

  return (
    <main
      className="min-h-screen px-5 pt-6 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-[#2C2C2C]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1
          className="text-3xl font-light text-[#2C2C2C]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Artists
        </h1>
      </div>

      <Link
        href="/admin/artists/new"
        className="flex items-center justify-center gap-2 w-full text-white py-3.5 rounded-full text-sm font-medium mb-6"
        style={{ background: "#3A4A3B" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Artist
      </Link>

      <div className="flex flex-col gap-3">
        {(profiles ?? []).map((a: Profile) => {
          const period = latestPeriods[a.id];
          return (
            <Link
              key={a.id}
              href={`/admin/artists/${a.id}`}
              className="bg-white rounded-2xl px-4 py-4 shadow-sm flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ background: "#3A4A3B", color: "#fff", fontFamily: "var(--font-cormorant)" }}
              >
                {(a.full_name ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-[#2C2C2C]">{a.full_name ?? "—"}</p>
                  <RoleBadge role={a.role} />
                </div>
                {a.handle && <p className="text-xs text-[#888]">{a.handle}</p>}
                {a.role === "guest" && period && (
                  <p className="text-xs text-[#AAA] mt-0.5">Until {period.end_date}</p>
                )}
                {a.role === "resident" && a.preferred_station && (
                  <p className="text-xs text-[#AAA] mt-0.5">Station {a.preferred_station}</p>
                )}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
          );
        })}

        {(profiles ?? []).length === 0 && (
          <p className="text-sm text-center text-[#888] py-8">No artists yet.</p>
        )}
      </div>
    </main>
  );
}
