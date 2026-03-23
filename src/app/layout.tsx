import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Arcfit Gym | Bangla Nagar, Bikaner",
  description:
    "Animated Arcfit Gym landing page with workouts, gallery, attendance tracking, and a diet helper for Bangla Nagar, Bikaner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
