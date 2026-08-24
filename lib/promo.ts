/**
 * Promo utilities, discount resolver, and WhatsApp share generators for Drippy Banks
 */

export const PROMO_STORAGE_KEY = 'drippybanks_applied_promo';
export const DEFAULT_PROMO_CODE = 'DRIP10';
export const DEFAULT_PROMO_DISCOUNT = 10;
export const PROMO_OG_IMAGE_PATH = '/promo-og.jpg';

export interface PromoCampaign {
    code: string;
    discountPercent: number;
    title: string;
    description: string;
    badge: string;
    expiresInHours?: number;
}

export const KNOWN_PROMO_CAMPAIGNS: Record<string, PromoCampaign> = {
    DRIP10: {
        code: 'DRIP10',
        discountPercent: 10,
        title: '10% OFF coupon for new users only',
        description: 'Super affordable streetwear! Final hours to grab savings.',
        badge: '⚡ FLASH DEAL 10% OFF',
    },
    WELCOME10: {
        code: 'WELCOME10',
        discountPercent: 10,
        title: '10% OFF Welcome Special',
        description: 'Exclusive 10% discount on your first order.',
        badge: '👑 VIP WELCOME',
    },
    DRIPPY10: {
        code: 'DRIPPY10',
        discountPercent: 10,
        title: '10% OFF Streetwear Promo',
        description: 'Save 10% on your streetwear order.',
        badge: '🔥 VIRAL DROP',
    },
    E44XS7D: {
        code: 'E44XS7D',
        discountPercent: 10,
        title: '10% OFF coupon for new users only',
        description: 'Exclusive promo code for instant savings.',
        badge: '⭐ EXCLUSIVE CODE',
    },
};

/**
 * Resolves discount percentage for any promo code entered or provided in query.
 * Falls back to extracting numbers from codes like "DRIP10", "SAVE15", etc. or defaults to 10%.
 */
export function resolvePromoDiscount(code?: string | null): number {
    if (!code) return 0;
    const cleanCode = code.trim().toUpperCase();

    if (KNOWN_PROMO_CAMPAIGNS[cleanCode]) {
        return KNOWN_PROMO_CAMPAIGNS[cleanCode].discountPercent;
    }

    // Try extracting numeric discount from patterns like DRIP10, SAVE15, PROMO20, etc.
    const match = cleanCode.match(/(\d{1,2})/);
    if (match) {
        const parsed = parseInt(match[1], 10);
        if (parsed > 0 && parsed <= 90) {
            return parsed;
        }
    }

    return DEFAULT_PROMO_DISCOUNT;
}

/**
 * Checks if a promo code is valid
 */
export function isValidPromoCode(code?: string | null): boolean {
    if (!code) return false;
    const cleanCode = code.trim().toUpperCase();
    if (KNOWN_PROMO_CAMPAIGNS[cleanCode]) return true;
    const discount = resolvePromoDiscount(cleanCode);
    return discount > 0;
}

/**
 * Gets currently saved promo code from localStorage (if in browser)
 */
export function getStoredPromoCode(): { code: string; discountPercent: number } | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(PROMO_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.code === 'string') {
            return {
                code: parsed.code.trim().toUpperCase(),
                discountPercent: typeof parsed.discountPercent === 'number' ? parsed.discountPercent : resolvePromoDiscount(parsed.code),
            };
        }
    } catch {
        // ignore parse error
    }
    return null;
}

/**
 * Saves promo code to localStorage
 */
export function saveStoredPromoCode(code: string, discountPercent?: number): void {
    if (typeof window === 'undefined') return;
    try {
        const cleanCode = code.trim().toUpperCase();
        const discount = discountPercent ?? resolvePromoDiscount(cleanCode);
        window.localStorage.setItem(
            PROMO_STORAGE_KEY,
            JSON.stringify({ code: cleanCode, discountPercent: discount, savedAt: Date.now() })
        );
    } catch {
        // ignore error
    }
}

/**
 * Removes saved promo code from localStorage
 */
export function clearStoredPromoCode(): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(PROMO_STORAGE_KEY);
    } catch {
        // ignore error
    }
}

/**
 * Generates the WhatsApp status / message promo text matching the SHEIN viral format with 10% OFF
 */
export function generateWhatsAppPromoCaption(options?: {
    code?: string;
    discountPercent?: number;
    url?: string;
    storeName?: string;
}): string {
    const code = (options?.code || DEFAULT_PROMO_CODE).trim().toUpperCase();
    const discount = options?.discountPercent || resolvePromoDiscount(code);
    const storeName = options?.storeName || 'Drippy Banks';
    const link = options?.url || (typeof window !== 'undefined' ? `${window.location.origin}/promo?code=${code}` : `https://drippybanks.chefu.co.za/promo?code=${code}`);

    return `🚨 Super affordable products! Final hours to grab savings!
💰 ${discount}% OFF coupon for new users only ⭐ Search ${code} on the ${storeName} App or ⭐ Click the link to get started!
${link}`;
}

/**
 * Generates a WhatsApp Web / App share URL
 */
export function getWhatsAppShareUrl(options?: {
    code?: string;
    discountPercent?: number;
    url?: string;
    storeName?: string;
}): string {
    const text = generateWhatsAppPromoCaption(options);
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Shares promo image along with the caption using Web Share API (supports WhatsApp Status on mobile).
 * Falls back to opening WhatsApp URL if Web Share with files is not available.
 */
export async function sharePromoWithImage(options?: {
    code?: string;
    discountPercent?: number;
    url?: string;
    storeName?: string;
    imagePath?: string;
}): Promise<boolean> {
    const caption = generateWhatsAppPromoCaption(options);
    const imagePath = options?.imagePath || PROMO_OG_IMAGE_PATH;

    // 1. Try Native Web Share API with image file (Supported on Mobile iOS & Android for WhatsApp Status)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            const file = new File([blob], 'drippybanks-10off-promo.jpg', { type: blob.type || 'image/jpeg' });

            if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Drippy Banks 10% OFF Promo',
                    text: caption,
                    files: [file],
                });
                return true;
            } else {
                await navigator.share({
                    title: 'Drippy Banks 10% OFF Promo',
                    text: caption,
                });
                return true;
            }
        } catch (err: unknown) {
            // If user closed/aborted the share sheet, return peacefully
            if (err instanceof Error && err.name === 'AbortError') {
                return true;
            }
            console.debug('[promo] Web share with file failed, falling back to direct WhatsApp link', err);
        }
    }

    // 2. Direct WhatsApp Web / App link fallback
    const shareUrl = getWhatsAppShareUrl(options);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    return true;
}

/**
 * Downloads the promo OG banner image directly to device gallery/downloads
 */
export async function downloadPromoImage(
    imagePath: string = PROMO_OG_IMAGE_PATH,
    filename: string = 'drippybanks-10off-promo.jpg'
): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
        const res = await fetch(imagePath);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        return true;
    } catch (err) {
        console.error('[promo] Failed to download promo image:', err);
        return false;
    }
}
