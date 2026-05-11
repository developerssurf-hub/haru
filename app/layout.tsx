import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haru Yo Koi | Academia de Idioma y Cultura Japonesa",
  description: "Aprende japonés y sumérgete en la cultura nipona con Haru Yo Koi. Cursos de JLPT, japonés para niños y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>

      <body className="antialiased min-h-screen selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
