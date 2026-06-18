"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BookingType, Booking } from "@/lib/types";

// ---- Slot availability check ----
export async function checkAvailabilityAction(
  station: number,
  date: string,
  bookingType: BookingType
): Promise<{ available: boolean; conflicts: Booking[] }> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("bookings")
    .select("*, profile:profiles!user_id(full_name,handle,avatar_url,role)")
    .eq("station", station)
    .eq("booking_date", date);

  if (!existing || existing.length === 0) return { available: true, conflicts: [] };

  const conflicts: Booking[] = [];
  for (const b of existing) {
    if (bookingType === "full") {
      conflicts.push(b); // full blocks everything
    } else if (bookingType === "am" && (b.booking_type === "full" || b.booking_type === "am")) {
      conflicts.push(b);
    } else if (bookingType === "pm" && (b.booking_type === "full" || b.booking_type === "pm")) {
      conflicts.push(b);
    }
  }

  return { available: conflicts.length === 0, conflicts };
}

// ---- Get free stations for a given date+type (for reassignment) ----
export async function getFreeStationsAction(
  date: string,
  bookingType: BookingType,
  excludeStation: number
): Promise<number[]> {
  const free: number[] = [];
  for (const s of [1, 2, 3, 4]) {
    if (s === excludeStation) continue;
    const { available } = await checkAvailabilityAction(s, date, bookingType);
    if (available) free.push(s);
  }
  return free;
}

// ---- Create a booking (with all validations) ----
export async function createBookingAction(data: {
  station: number;
  booking_date: string;
  booking_type: BookingType;
  user_id?: string; // if admin booking for someone else
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, preferred_station")
    .eq("id", user.id)
    .single();

  const targetUserId = data.user_id ?? user.id;

  // Guest date range validation
  if (profile?.role === "guest") {
    const { data: periods } = await supabase
      .from("guest_periods")
      .select("start_date, end_date")
      .eq("user_id", targetUserId)
      .lte("start_date", data.booking_date)
      .gte("end_date", data.booking_date)
      .limit(1);

    if (!periods || periods.length === 0) {
      return { error: "You can only book within your assigned date range." };
    }
  }

  // Conflict check
  const { available, conflicts } = await checkAvailabilityAction(
    data.station, data.booking_date, data.booking_type
  );
  if (!available) {
    return { error: "This slot is already taken.", conflicts };
  }

  const { error } = await supabase.from("bookings").insert({
    user_id: targetUserId,
    station: data.station,
    booking_date: data.booking_date,
    booking_type: data.booking_type,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/schedule");
  revalidatePath("/map");
  return { success: true };
}

// ---- Admin: reassign someone + book own station (atomic) ----
export async function reassignAndBookAction(data: {
  conflict_booking_id: string;
  new_station_for_evictee: number;
  admin_station: number;
  booking_date: string;
  booking_type: BookingType;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Admin only." };

  // Verify target station is actually free
  const { available } = await checkAvailabilityAction(
    data.new_station_for_evictee, data.booking_date, data.booking_type
  );
  if (!available) return { error: "Target station is also taken. Pick another." };

  // Atomic reassign via RPC
  const { error } = await supabase.rpc("reassign_and_book", {
    p_conflict_booking_id: data.conflict_booking_id,
    p_new_station: data.new_station_for_evictee,
    p_admin_user_id: user.id,
    p_admin_station: data.admin_station,
    p_date: data.booking_date,
    p_booking_type: data.booking_type,
  });

  if (error) return { error: error.message };

  revalidatePath("/schedule");
  revalidatePath("/map");
  return { success: true };
}

// ---- Admin: move a booking to a different station ----
export async function updateBookingStationAction(bookingId: string, newStation: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "Admin only." };

  const { data: booking } = await supabase
    .from("bookings")
    .select("booking_date, booking_type, station")
    .eq("id", bookingId)
    .single();
  if (!booking) return { error: "Booking not found." };
  if (booking.station === newStation) return { success: true };

  // Make sure the target station is free for this date + slot type
  const { available } = await checkAvailabilityAction(
    newStation, booking.booking_date, booking.booking_type
  );
  if (!available) return { error: `Bancada ${newStation} já está ocupada.` };

  const { error } = await supabase
    .from("bookings")
    .update({ station: newStation, updated_at: new Date().toISOString() })
    .eq("id", bookingId);

  if (error) return { error: error.message };

  revalidatePath("/schedule");
  revalidatePath("/map");
  return { success: true };
}

// ---- Delete a booking ----
export async function deleteBookingAction(bookingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) return { error: error.message };

  revalidatePath("/schedule");
  revalidatePath("/map");
  return { success: true };
}

// ---- Get bookings for a date (with profile info) ----
export async function getBookingsForDateAction(date: string): Promise<Booking[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, profile:profiles!user_id(full_name,handle,avatar_url,role)")
    .eq("booking_date", date)
    .order("station");
  return (data ?? []) as Booking[];
}
