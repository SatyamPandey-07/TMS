import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Oswald, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import Chatbot from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Girly fonts
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Manly fonts
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "TurfBooking - Premium Turf Booking Platform",
  description: "Book premium sports turfs instantly with our modern booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${poppins.variable} ${oswald.variable} ${roboto.variable} antialiased theme-transition`}
      >
        <ThemeProviderWrapper>
          <SessionWrapper>
            {children}
            <Chatbot />
          </SessionWrapper>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
