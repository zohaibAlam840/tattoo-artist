import Link from "next/link";
import Image from "next/image";
import Monogram from "@/components/Monogram";

export default function Home() {
  return (
    <main
      className="flex flex-col min-h-screen px-5 pt-10 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <Monogram size={88} />
        <h1
          className="text-center text-[#2C2C2C] leading-none mt-3"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.6rem, 11vw, 3.4rem)",
            fontWeight: 300,
            letterSpacing: "0.08em",
          }}
        >
          QUANTICA
        </h1>
        <p
          className="text-[#2C2C2C] mt-2 tracking-[0.28em] text-xs uppercase"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Tattoo Studio
        </p>
      </div>

      {/* Studio photo */}
      <div className="relative flex-1 mt-5 mb-4 rounded-2xl overflow-hidden" style={{ minHeight: "260px" }}>
        <Image
          src="/images/WhatsApp Image 2026-05-28 at 15.30.59.jpeg"
          alt="Quantica Tattoo Studio"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Info button */}
      <Link
        href="/guest"
        className="block w-full text-center text-white py-4 rounded-full text-base font-medium"
        style={{ background: "#3A4A3B", fontFamily: "var(--font-dm-sans)" }}
      >
        Informações do Estúdio
      </Link>
    </main>
  );
}
