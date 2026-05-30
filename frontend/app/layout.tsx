import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
