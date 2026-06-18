import Image from "next/image";

const RATIO = 152 / 607; // intrinsic height / width of wordmark.png

export default function Wordmark({ width = 240 }: { width?: number }) {
  return (
    <Image
      src="/wordmark.png"
      alt="Quantica Tattoo Studio"
      width={width}
      height={Math.round(width * RATIO)}
      className="object-contain"
      priority
    />
  );
}
