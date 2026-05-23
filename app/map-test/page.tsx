import Image from "next/image";

export default function MapTest() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm w-full">
        <h1 className="text-center text-xl font-bold mb-4">Studio Map</h1>
        <Image
          src="/floor-plan.svg"
          alt="Studio floor plan"
          width={625}
          height={1230}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
