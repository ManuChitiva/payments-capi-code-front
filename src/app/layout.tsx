import type { Metadata } from "next";
import { Geist_Mono, Great_Vibes, Manrope, DM_Serif_Display } from "next/font/google";
import { AppProviders } from "@/components/store/app-providers";
import { themeInitScriptContent } from "@/lib/theme-storage";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brandScript = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brand-script",
});

const displaySerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-serif",
});

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Tienda en línea parametrizable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${manrope.variable} ${geistMono.variable} ${brandScript.variable} ${displaySerif.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScriptContent }}
        />
      </head>
      <body className="flex min-h-[100dvh] min-h-screen w-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
