"use client";

/**
 * Slow floating ambient light streaks + leather/gold glows that sit behind
 * the whole page to sell the "traveling through reflections" feeling.
 */
export default function AmbientLights() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-40 top-[10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(200,150,79,0.14),transparent_65%)] blur-2xl animate-floaty" />
      <div className="absolute -right-48 top-[42%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(107,69,39,0.22),transparent_65%)] blur-2xl animate-floaty [animation-delay:-3s]" />
      <div className="absolute left-[20%] bottom-[6%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(120,130,140,0.10),transparent_65%)] blur-2xl animate-floaty [animation-delay:-5s]" />
    </div>
  );
}
