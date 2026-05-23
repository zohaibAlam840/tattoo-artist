import Link from "next/link";

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="23" stroke="#3A4A3B" strokeWidth="1.5" />
      <path d="M14 24l8 8 12-14" stroke="#3A4A3B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GuestStep3() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 pb-8"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Step indicator */}
      <div className="flex gap-1.5 mb-12 w-full max-w-xs">
        <div className="h-1 flex-1 rounded-full" style={{ background: "#3A4A3B" }} />
        <div className="h-1 flex-1 rounded-full" style={{ background: "#3A4A3B" }} />
        <div className="h-1 flex-1 rounded-full" style={{ background: "#3A4A3B" }} />
      </div>

      <CheckIcon />

      <h1
        className="text-3xl font-light text-[#2C2C2C] text-center mt-6 mb-3"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        All set!
      </h1>
      <p className="text-sm text-[#888] text-center max-w-xs mb-12">
        The guest artist info has been saved. The admin will confirm the station assignment.
      </p>

      {/* Summary card */}
      <div className="w-full max-w-sm bg-white rounded-2xl px-5 py-5 shadow-sm mb-8">
        <p className="text-xs text-[#888] uppercase tracking-widest mb-4">Summary</p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Name", value: "—" },
            { label: "Handle", value: "—" },
            { label: "Period", value: "—" },
            { label: "Preferred Station", value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-xs text-[#888]">{label}</span>
              <span className="text-sm font-medium text-[#2C2C2C]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="block w-full max-w-sm text-center text-white py-4 rounded-full text-base font-medium"
        style={{ background: "#3A4A3B" }}
      >
        Back to Home
      </Link>
    </main>
  );
}
