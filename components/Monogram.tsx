import Image from "next/image";

export default function Monogram({ size = 88 }: { size?: number }) {
  return (
    <Image
      src="/logo-removebg-preview.png"
      alt="Quantica Tattoo Studio"
      width={size}
      height={size}
      className="object-contain"
      priority
    />
  );
}
