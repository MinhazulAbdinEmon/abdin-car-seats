"use client";

/**
 * The ACS / Abdin logo with a moving shimmer sheen (masked to the logo shape,
 * same shimmer2 sweep as the ShimmerButton) plus a soft ambient glow halo.
 */
export default function ShimmerLogo({
  src = "/images/logo.png",
  alt = "Abdin Auto Seats Upholstery",
  className = "",
}) {
  const mask = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };

  return (
    <span className={`relative isolate inline-block ${className}`}>
      {/* soft glow halo */}
      <span className="pointer-events-none absolute inset-0 z-0 scale-110 rounded-full bg-[radial-gradient(circle,rgba(120,180,235,0.45),transparent_70%)] blur-md" />
      {/* logo */}
      <img src={src} alt={alt} className="relative z-10 h-full w-full object-contain" />
      {/* shimmer sheen, clipped to the logo silhouette */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 animate-[shimmer2_3.5s_infinite_linear] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.65)_47%,rgba(170,215,255,0.55)_53%,transparent_70%)] [background-size:200%_100%]"
        style={mask}
      />
    </span>
  );
}
