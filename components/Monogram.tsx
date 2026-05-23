export default function Monogram({ size = 88 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 88 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="44" cy="50" rx="40" ry="47" stroke="#2C2C2C" strokeWidth="1.4" fill="none" />
      {/* Inner decorative oval */}
      <ellipse cx="44" cy="50" rx="35" ry="42" stroke="#2C2C2C" strokeWidth="0.5" fill="none" strokeDasharray="1 3" />
      {/* Monogram letters */}
      <text
        x="44"
        y="43"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), serif"
        fontSize="18"
        fill="#2C2C2C"
        fontStyle="italic"
        fontWeight="400"
        letterSpacing="2"
      >
        LM
      </text>
      <text
        x="44"
        y="63"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), serif"
        fontSize="18"
        fill="#2C2C2C"
        fontStyle="italic"
        fontWeight="400"
        letterSpacing="2"
      >
        DA
      </text>
    </svg>
  );
}
