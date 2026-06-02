"use client";

/**
 * Static leather/gold ambient glows behind the page.
 * NOTE: these are intentionally NOT animated — moving a large blurred element
 * forces the browser to re-rasterize the blur every frame, which is expensive.
 * Static blurred gradients are painted once and are essentially free.
 */
export default function AmbientLights() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-40 top-[10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(200,150,79,0.13),transparent_65%)] blur-2xl" />
      <div className="absolute -right-48 top-[42%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(107,69,39,0.2),transparent_65%)] blur-2xl" />
      <div className="absolute left-[20%] bottom-[6%] hidden h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(120,130,140,0.1),transparent_65%)] blur-2xl sm:block" />
    </div>
  );
}
