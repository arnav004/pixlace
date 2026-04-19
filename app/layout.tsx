import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixlAce - Resize images to exact dimensions & file size",
  description: "Set exact pixel dimensions and target file size (KB) in one step. Perfect for government portals, visa applications, and job forms.",
  keywords: "image resizer, resize image KB, photo resize dimensions, passport photo resize, government portal photo, pixlace",
  openGraph: {
    title: "PixlAce - Resize images to exact dimensions & file size",
    description: "Set exact pixel dimensions and target file size (KB) in one step.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
