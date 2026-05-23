"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const INFO_ITEMS = [
  {
    title: "Booking System",
    body: "You can book a station from the Schedule page. Choose Full Day, AM (until 1pm), or PM (after 1pm). You can only book within the dates your admin has assigned to you.",
  },
  {
    title: "Stations",
    body: "There are 4 workstations available. Check the Map page to see which stations are free on any given day.",
  },
  {
    title: "Your Dates",
    body: "Your booking period is set by the studio admin. Outside of those dates, you won't be able to make reservations. Contact the admin if you need your dates extended.",
  },
  {
    title: "House Rules",
    body: "Keep your station clean after each session. Shared areas (sink, printer, lounge) are for everyone. Respect the other artists' space and schedule.",
  },
  {
    title: "Need Help?",
    body: "Reach out to the studio admin for any questions about your booking, station assignment, or stay.",
  },
];

export default function GuestInfo() {
  const router = useRouter();
  const { profile } = useAuth();

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
        Guest Artist Guide
      </h1>
      <p className="text-sm text-[#888] mb-8">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}. Here's everything you need to know.
      </p>

      <div className="flex flex-col gap-3">
        {INFO_ITEMS.map((item) => (
          <div key={item.title} className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <p
              className="text-base font-medium text-[#2C2C2C] mb-1"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {item.title}
            </p>
            <p className="text-sm text-[#666] leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/schedule")}
        className="w-full text-white py-4 rounded-full text-base font-medium mt-8"
        style={{ background: "#3A4A3B" }}
      >
        Go to Schedule
      </button>
    </main>
  );
}
