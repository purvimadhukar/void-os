import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VOID OS",
  description: "A cinematic browser-based desktop OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
