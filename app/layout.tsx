import Layout from "@/components/layout";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://banjo-rolls-deluxe.twait.dev"),
  title: {
    default: "Banjo Rolls Deluxe",
    template: "%s | Banjo Rolls Deluxe",
  },
  description: "Practice banjo rolls. Deluxe.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icon.png",
    },
  },
  openGraph: {
    title: "Banjo Rolls Deluxe",
    description: "Practice banjo rolls. Deluxe.",
    url: "https://banjo-rolls-deluxe.twait.dev",
    siteName: "Banjo Rolls Deluxe",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Desolation Rows",
    card: "summary_large_image",
  },
  verification: {
    google: "google",
    yandex: "yandex",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} text-black bg-white dark:text-white dark:bg-black`}
    >
      <body className="antialiased">
        <Layout>
          {children}
          {/* <Footer /> */}
        </Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
