import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/store/app-providers";
import { themeInitScriptContent } from "@/lib/theme-storage";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
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
