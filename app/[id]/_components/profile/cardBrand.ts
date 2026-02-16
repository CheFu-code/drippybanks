import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcVisa, FaCreditCard } from "react-icons/fa";
import { IconType } from "react-icons";

export const detectCardBrand = (cardDigits: string): string => {
    if (/^4/.test(cardDigits)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(cardDigits)) return "Mastercard";
    if (/^3[47]/.test(cardDigits)) return "American Express";
    if (/^6(?:011|5)/.test(cardDigits)) return "Discover";
    if (/^(50|5[6-9]|6[0-9])/.test(cardDigits)) return "Maestro";
    return "Unknown";
};

export const getCardBrandIcon = (brand?: string): IconType => {
    switch (brand) {
        case "Visa":
            return FaCcVisa;
        case "Mastercard":
            return FaCcMastercard;
        case "American Express":
            return FaCcAmex;
        case "Discover":
            return FaCcDiscover;
        default:
            return FaCreditCard;
    }
};
