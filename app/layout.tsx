import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://drippybanks.chefuinc.com"),
    title: {
        default: "Drippy Banks | Premium Streetwear",
        template: "%s | Drippy Banks",
    },
    description:
        "Drippy Banks is the premium streetwear destination for bold drops, elevated essentials, and seamless CHEFU account access.",
    openGraph: {
        title: "Drippy Banks | Premium Streetwear",
        description:
            "Drippy Banks is the premium streetwear destination for bold drops, elevated essentials, and seamless CHEFU account access.",
        url: "https://drippybanks.chefuinc.com",
        siteName: "Drippy Banks",
        images: [
            {
                url: "/promo-og.jpg",
                width: 1280,
                height: 720,
                alt: "Drippy Banks Streetwear",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Drippy Banks | Premium Streetwear",
        description:
            "Drippy Banks is the premium streetwear destination for bold drops and elevated essentials.",
        images: ["/promo-og.jpg"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-950 text-slate-100`}
            >
                <CartProvider>
                    {children}
                    <Toaster />
                </CartProvider>
            </body>
        </html>
    );
}
