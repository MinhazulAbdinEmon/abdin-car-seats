"use client";

import { Armchair, Sparkles, Scissors, Car, Disc3, Brush } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

/**
 * Replaces the old horizontal gallery with the radial orbital timeline,
 * populated with Abdin's craft services as orbiting nodes (click to expand).
 * Edit the `services` array below to change nodes/content.
 */
const services = [
  {
    id: 1,
    title: "Seat Upholstery",
    date: "Bespoke",
    content: "Full leather & Alcantara re-trims with custom quilting and piping.",
    category: "Upholstery",
    icon: Armchair,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Leather Restoration",
    date: "Restore",
    content: "Cracked, worn and faded interiors brought back beyond showroom.",
    category: "Restoration",
    icon: Sparkles,
    relatedIds: [1, 6],
    status: "completed",
    energy: 92,
  },
  {
    id: 3,
    title: "Custom Stitching",
    date: "Detail",
    content: "Diamond quilting, contrast piping and embroidered logos.",
    category: "Stitching",
    icon: Scissors,
    relatedIds: [1, 4],
    status: "completed",
    energy: 86,
  },
  {
    id: 4,
    title: "Roof Lining",
    date: "Cabin",
    content: "Sagging headliners replaced with suede or leather, flawlessly.",
    category: "Interior",
    icon: Car,
    relatedIds: [3, 5],
    status: "completed",
    energy: 78,
  },
  {
    id: 5,
    title: "Steering Wrap",
    date: "Grip",
    content: "Hand-stitched perforated leather grips, bespoke to your hands.",
    category: "Detail",
    icon: Disc3,
    relatedIds: [4, 6],
    status: "completed",
    energy: 70,
  },
  {
    id: 6,
    title: "Interior Detailing",
    date: "Finish",
    content: "Showroom-grade detailing, sealed and delivered.",
    category: "Finish",
    icon: Brush,
    relatedIds: [2, 5],
    status: "completed",
    energy: 64,
  },
];

export default function CraftOrbit() {
  return (
    <section id="gallery" className="relative z-10 bg-black">
      {/* heading overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 pt-20 text-center sm:pt-24">
        <p className="eyebrow text-gold/70">Our Craft</p>
        <h2 className="display mx-auto mt-3 max-w-2xl text-3xl text-cream sm:text-5xl">
          Explore the <span className="text-gold-grad">services</span>
        </h2>
        <p className="mt-3 text-sm text-cream/55">Tap a node to discover each craft.</p>
      </div>

      <RadialOrbitalTimeline timelineData={services} />
    </section>
  );
}
