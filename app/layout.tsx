import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KamiFlow | Set & Forget Factuurverwerking voor Salons",
  description:
    "Rust in je salon. KamiFlow herkent automatisch inkomende facturen in je mailbox en stuurt ze direct door naar je boekhouding.",
  keywords: [
    "facturen",
    "kappers",
    "schoonheidsspecialiste",
    "beauty salon",
    "boekhouding automatisering",
    "Moneybird",
    "Exact Online",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`h-full scroll-smooth ${cormorant.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen bg-[#faf9f6] text-[#2b302c] font-sans antialiased selection:bg-kami-200 selection:text-kami-900">
        {children}
      </body>
    </html>
  );
}
