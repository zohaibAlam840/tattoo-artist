import Link from "next/link";
import Image from "next/image";
import Monogram from "@/components/Monogram";
import Wordmark from "@/components/Wordmark";

export default function Home() {
  return (
    <main
      className="flex flex-col min-h-screen px-5 pt-10 pb-4"
      style={{ background: "#EAE5DF", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <Monogram size={140} />
        <div className="mt-4">
          <Wordmark width={260} />
        </div>
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
