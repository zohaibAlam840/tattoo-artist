"use server";
import { createClient } from "@/lib/supabase/server";
import { adminSupabase } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Role } from "@/lib/types";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return user;
}

export async function createUserAction(data: {
  email: string;
  password: string;
  full_name: string;
  handle: string;
  role: Role;
  preferred_station?: number | null;
  guest_start?: string;
  guest_end?: string;
}) {
  const admin = await assertAdmin();

  // Create auth user (service role bypasses email confirmation)
  const { data: authData, error } = await adminSupabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: { full_name: data.full_name, role: data.role },
  });

  if (error) return { error: error.message };
  const userId = authData.user.id;

  // Update profile (trigger auto-created it, now add extra fields)
  await adminSupabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      handle: data.handle,
      role: data.role,
      preferred_station: data.preferred_station ?? null,
    })
    .eq("id", userId);

  // If guest, create their first booking period
  if (data.role === "guest" && data.guest_start && data.guest_end) {
    await adminSupabase.from("guest_periods").insert({
      user_id: userId,
      start_date: data.guest_start,
      end_date: data.guest_end,
      created_by: admin.id,
    });
  }

  revalidatePath("/admin/artists");
  return { success: true, userId };
}

export async function updateUserAction(
  userId: string,
  data: Partial<{
    full_name: string;
    handle: string;
    role: Role;
    preferred_station: number | null;
  }>
) {
  await assertAdmin();
  const { error } = await adminSupabase.from("profiles").update(data).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/artists");
  revalidatePath(`/admin/artists/${userId}`);
  return { success: true };
}

export async function updateOwnProfileAction(data: Partial<{
  full_name: string;
  handle: string;
  preferred_station: number | null;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("profiles").update(data).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/profile");
  revalidatePath("/settings");
  return { success: true };
}

export async function addGuestPeriodAction(data: {
  user_id: string;
  start_date: string;
  end_date: string;
}) {
  const admin = await assertAdmin();
  const { error } = await adminSupabase.from("guest_periods").insert({
    ...data,
    created_by: admin.id,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/artists/${data.user_id}`);
  return { success: true };
}

export async function uploadAvatarAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const path = `${user.id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/profile");
  return { success: true, url: publicUrl };
}

export async function getProfilesAction() {
  await assertAdmin();
  const { data, error } = await adminSupabase
    .from("profiles")
    .select("*")
    .order("role")
    .order("full_name");
  if (error) return { error: error.message, profiles: [] };
  return { profiles: data ?? [] };
}

export async function getProfileWithPeriodsAction(userId: string) {
  await assertAdmin();
  const [{ data: profile }, { data: periods }] = await Promise.all([
    adminSupabase.from("profiles").select("*").eq("id", userId).single(),
    adminSupabase
      .from("guest_periods")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false }),
  ]);
  return { profile: profile ?? null, periods: periods ?? [] };
}
