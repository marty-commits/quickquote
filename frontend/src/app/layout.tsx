import type { Metadata } from "next";
import "./globals.css";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";
import { Navbar } from "@/components/layout/Navbar";
import { StoreHydration } from "@/components/StoreHydration";

export const metadata: Metadata = {
  title: "Easy Roof Estimate",
  description: "Get a free roofing estimate in minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleMapsProvider>
          <StoreHydration />
          <Navbar />
          <main>{children}</main>
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
