import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
        <html lang="fr" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryProvider>{children}</QueryProvider>
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-NYXVF30Q6P" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-NYXVF30Q6P');
                    `}
                </Script>
            </body>
        </html>
    );
}
