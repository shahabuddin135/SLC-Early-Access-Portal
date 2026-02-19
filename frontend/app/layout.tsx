import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://slc-early-access-portal.vercel.app";

export const metadata: Metadata = {
  title: "SLC Early Access — WeWise Labs",
  description:
    "Register for early access to the SLC language & framework. Download the files, build a project, and submit your review.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "SLC Early Access — WeWise Labs",
    description:
      "Register for early access to the SLC language & framework. Download the files, build a project, and submit your review.",
    url: BASE_URL,
    siteName: "SLC Early Access Portal",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SLC Early Access — WeWise Labs",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SLC Early Access — WeWise Labs",
    description:
      "Register for early access to the SLC language & framework.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-sans": GeistSans.style.fontFamily,
          "--font-mono": GeistMono.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
