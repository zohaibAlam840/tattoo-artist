export type Role = 'admin' | 'resident' | 'guest'
export type BookingType = 'full' | 'am' | 'pm'

export interface Profile {
  id: string
  email: string
  full_name: string
  handle: string
  role: Role
  preferred_station: number | null
  avatar_url: string | null
  created_at: string
}

export interface GuestPeriod {
  id: string
  user_id: string
  start_date: string  // YYYY-MM-DD
  end_date: string    // YYYY-MM-DD
  created_by: string
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  station: number
  booking_date: string  // YYYY-MM-DD
  booking_type: BookingType
  created_at: string
  profile?: Pick<Profile, 'full_name' | 'handle' | 'avatar_url' | 'role'>
}

export interface StationSlot {
  station: number
  am: Booking | null
  pm: Booking | null
  full: Booking | null
}
