import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";

export const metadata = {
  title: `${site.brand} — Luxury Upholstery Redefined`,
  description:
    "Premium custom car interiors crafted for comfort, elegance and identity. Leather seats, upholstery, steering wraps, roof lining and full interior restoration.",
  keywords: [
    "luxury car upholstery",
    "custom leather seats",
    "car interior restoration",
    "steering wheel wrapping",
    "roof lining",
    site.brand,
  ],
};

export const viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
