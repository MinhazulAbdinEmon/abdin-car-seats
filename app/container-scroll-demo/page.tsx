"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

// Note: a route file may only export `default` (+ Next metadata exports),
// so the demo wrapper stays local instead of being exported.
function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[1000px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        {/* Aceternity demo used a remote webp; swapped for a local brand image
            so the demo renders without configuring next/image remotePatterns. */}
        <Image
          src="/images/car-seats.jpg"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default function Page() {
  return <HeroScrollDemo />;
}
