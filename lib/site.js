// ────────────────────────────────────────────────────────────────
//  ABDIN CAR SEATS — central site config
//  👉 EDIT THE PHONE / WHATSAPP / LOCATION BELOW WITH YOUR REAL DETAILS
// ────────────────────────────────────────────────────────────────

export const site = {
  brand: "Abdin Auto Seats Upholstery",
  legalName: "Abdin Auto Seats Upholstery L.L.C",
  short: "ACS",
  tagline: "Premium Auto Interiors",

  // Use international format, digits only, no "+" or spaces.
  // Example for a UAE number: "971501234567"
  whatsapp: "0000000000",

  // Display phone (any format you like)
  phone: "+00 000 000 0000",

  email: "info@abdincarseats.com",

  // Shown in the contact section + used for the map embed query
  location: "Abdin Auto Seats Upholstery, UAE",
  // exact pin coordinates from the shop's Google Maps listing
  mapQuery: "25.4017024,55.4453499",
  mapLink: "https://maps.app.goo.gl/eWMMAEJM4NjHn6R1A",

  socials: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
  },
};

export const whatsappLink = (msg = "Hello Abdin Car Seats, I'd like to discuss a custom interior.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
