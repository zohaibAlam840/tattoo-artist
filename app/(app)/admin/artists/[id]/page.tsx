import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminSupabase } from "@/lib/supabase/admin";
import ArtistEditForm from "./ArtistEditForm";
import type { GuestPeriod } from "@/lib/types";

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (myProfile?.role !== "admin") redirect("/");

  const [{ data: profile }, { data: periods }] = await Promise.all([
    adminSupabase.from("profiles").select("*").eq("id", id).single(),
    adminSupabase
      .from("guest_periods")
      .select("*")
      .eq("user_id", id)
      .order("start_date", { ascending: false }),
  ]);

  if (!profile) notFound();

  return (
    <ArtistEditForm
      profile={profile}
      periods={(periods ?? []) as GuestPeriod[]}
    />
  );
}
