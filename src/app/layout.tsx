import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
