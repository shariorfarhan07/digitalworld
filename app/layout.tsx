import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import SmoothScroll from "@/lib/SmoothScroll";
import Cursor from "@/components/ui/Cursor";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://idigitalworld.example.com"),
  title: "iDigital World — Founder-Led Digital Growth Studio",
  description:
    "Brand identity, website design and build, content creation and digital marketing — handled through one clear growth roadmap. Start with a free homepage mockup.",
  icons: { icon: "/brand/favicon-dark.png" },
  openGraph: {
    title: "iDigital World — Founder-Led Digital Growth Studio",
    description:
      "One roadmap. Brand, website, content and marketing built to turn clicks into clients. Start with a free homepage mockup.",
    images: ["/og.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${bricolage.variable} ${GeistSans.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll>
          {children}
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
