import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import QuoteCheckoutModal from "@/components/checkout/QuoteCheckoutModal";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { SITE_URL } from "@/lib/site";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Engines Market",
  description:
    "Compare prices for reconditioned, rebuilt and used engines from trusted UK engine specialists.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
                <Script
          src="https://js.clickrank.ai/seo/de019d8b-2456-42e0-b196-442de9f3c54c/script"
          strategy="afterInteractive"
        />
        </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <QuoteCheckoutModal brandName="replacement" />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
