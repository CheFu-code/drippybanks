import { Metadata } from 'next';
import { PromoLandingContent } from './_components/PromoLandingContent';
import { DEFAULT_PROMO_CODE, resolvePromoDiscount } from '@/lib/promo';

interface PageProps {
    searchParams: Promise<{
        code?: string | string[];
        discount?: string | string[];
    }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const rawCode = Array.isArray(resolvedParams.code) ? resolvedParams.code[0] : resolvedParams.code;
    const code = (rawCode || DEFAULT_PROMO_CODE).trim().toUpperCase();
    const discount = resolvePromoDiscount(code);

    const title = `💰 ${discount}% OFF coupon for new users only ⭐ Search ${code} on Drippy Banks or ⭐ Click the link to get started!`;
    const description = `🚨 Super affordable products! Final hours to grab savings! 💰 ${discount}% OFF coupon for new users only ⭐ Search ${code} on Drippy Banks or ⭐ Click the link to get started!`;
    const canonicalUrl = `https://drippybanks.chefuinc.com/promo?code=${code}`;

    return {
        title,
        description,
        metadataBase: new URL('https://drippybanks.chefuinc.com'),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Drippy Banks',
            type: 'website',
            images: [
                {
                    url: '/promo-og.jpg',
                    width: 1280,
                    height: 720,
                    alt: `${discount}% OFF Drippy Banks Streetwear Promo Code ${code}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/promo-og.jpg'],
        },
    };
}

export default async function PromoPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const initialCode = (Array.isArray(resolvedParams.code) ? resolvedParams.code[0] : resolvedParams.code) || DEFAULT_PROMO_CODE;

    return <PromoLandingContent initialCode={initialCode} />;
}
