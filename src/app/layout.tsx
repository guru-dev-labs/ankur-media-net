import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campaign Watchdog – Detect, Alert, Act",
  description: "Made by Ankur Agarwal| IIM Kozhikode",
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
        {children}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          Made with ♥ by{" "}
          <a
            href="https://www.linkedin.com/in/ankuraagarwal/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline"
          >
            Ankur Agarwal
          </a>
        </footer>
      </body>
    </html>
  );
}
