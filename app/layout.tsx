import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkateInfo - 滑板資訊網站",
  description: "推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境",
  verification: {
    google: "336cbb77b6f46dc6",
  },
  keywords: [
    "滑板",
    "skateboard", 
    "滑板教學",
    "滑板技巧",
    "滑板裝備",
    "滑板文化",
    "街頭滑板",
    "滑板社群",
    "台灣滑板",
    "滑板指南"
  ],
  authors: [{ name: "SkateInfo Team" }],
  creator: "SkateInfo",
  publisher: "SkateInfo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://your-domain.com',
    title: 'SkateInfo - 滑板資訊網站',
    description: '推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境',
    siteName: 'SkateInfo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkateInfo - 滑板資訊網站',
    description: '推廣滑板文化、社群活動與教育，打造更友善、更包容的滑板環境',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
