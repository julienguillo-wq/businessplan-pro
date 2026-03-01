import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BusinessPlan Pro — Générateur de Business Plan par IA",
  description:
    "Créez votre business plan professionnel en 10 minutes grâce à l'intelligence artificielle. Étude de marché, prévisionnel financier, stratégie commerciale — tout est généré automatiquement.",
  keywords: [
    "business plan",
    "générateur business plan",
    "business plan IA",
    "créer business plan",
    "prévisionnel financier",
    "étude de marché",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
