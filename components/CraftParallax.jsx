"use client";

import { TextParallaxContent } from "@/components/ui/text-parallax-content-scroll";
import { whatsappLink } from "@/lib/site";

/**
 * Feature section built on the Text Parallax Content Scroll component,
 * using Abdin's real photos. Each panel: a sticky image with overlay copy
 * that parallaxes, then a dark content block. Edit panels/text below.
 */
function Content({ heading, body, cta = "Contact on WhatsApp" }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
      <h2 className="display col-span-1 text-3xl text-cream md:col-span-4 md:text-4xl">{heading}</h2>
      <div className="col-span-1 md:col-span-8">
        {body.map((p, i) => (
          <p key={i} className="mb-4 text-lg text-cream/65 md:text-xl">{p}</p>
        ))}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold mt-4"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}

export default function CraftParallax() {
  return (
    <section id="gallery" className="relative z-10 bg-ink">
      {/* heading */}
      <div className="px-6 pb-4 pt-20 text-center sm:pt-24">
        <p className="eyebrow text-gold/70">Our Work</p>
        <h2 className="display mx-auto mt-3 max-w-2xl text-3xl text-cream sm:text-5xl">
          A closer <span className="text-gold-grad">look</span>
        </h2>
      </div>

      <TextParallaxContent
        imgUrl="/images/car-seats.jpg"
        subheading="Automotive"
        heading="Luxury car interiors."
      >
        <Content
          heading="Premium seat upholstery"
          body={[
            "Full leather and Alcantara re-trims with diamond quilting, contrast piping and embroidered detailing — engineered to fit your vehicle precisely.",
            "Every seam is hand-finished for a flawless, durable result that ages beautifully.",
          ]}
        />
      </TextParallaxContent>

      <TextParallaxContent
        imgUrl="/images/sofa.jpg"
        subheading="Furniture"
        heading="Beyond the cabin."
      >
        <Content
          heading="Sofa & lounge reupholstery"
          body={[
            "The same craftsmanship applied to home and lounge furniture — sofas re-skinned in premium leather and fabric, restored to better than new.",
            "Bespoke colours, textures and finishes to match your space.",
          ]}
        />
      </TextParallaxContent>

      <TextParallaxContent
        imgUrl="/images/bed.jpg"
        subheading="Bespoke"
        heading="Detail, everywhere."
      >
        <Content
          heading="Custom headboards & finishes"
          body={[
            "Padded headboards, panels and bespoke upholstery pieces crafted to order — quilted, buttoned and tailored to your design.",
            "Tell us your vision and we'll build it.",
          ]}
        />
      </TextParallaxContent>
    </section>
  );
}
