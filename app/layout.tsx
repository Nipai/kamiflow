import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="nl" className="h-full scroll-smooth">
      <body className="min-h-screen bg-[#faf9f6] text-[#2d312e] font-sans antialiased selection:bg-kami-200 selection:text-kami-900">
        {children}
      </body>
    </html>
  );
}
