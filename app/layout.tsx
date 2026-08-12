import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./templates/css/window.css";
import "./templates/css/project.css";
import "./templates/css/buttons.css";
import "./templates/css/link.css";
import "./templates/css/profile.css";
import Darkmode from "./templates/darkmode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Improve Profilo",
  description: "A professional portfolio platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Darkmode>
          {children}
        </Darkmode>
      </body>
    </html>
  );
}
