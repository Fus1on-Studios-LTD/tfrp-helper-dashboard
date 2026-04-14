import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TFRP Staff Dashboard",
  description: "Discord staff dashboard for tickets, moderation, and staff management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
