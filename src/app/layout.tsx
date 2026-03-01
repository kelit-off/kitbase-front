import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/libs/QueryProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "KitBase — Bases de données managées",
        template: "%s | KitBase",
    },
    description: "Déployez, faites évoluer et sécurisez vos bases de données PostgreSQL en quelques minutes. KitBase gère les sauvegardes, la haute disponibilité et le monitoring pour vous.",
    keywords: ["base de données", "PostgreSQL", "DBaaS", "cloud", "managé", "kitbase"],
    authors: [{ name: "KitBase" }],
    creator: "KitBase",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function () {
  const appearance = 'dark'; // 'light' | 'dark' | 'system'
  const root = document.documentElement;

  const isDark =
    appearance === 'dark' ||
    (appearance === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  root.classList.toggle('dark', isDark);
})();
            `,
                    }}
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
