export type UserRole = "guest" | "customer" | "admin" | "vendor";
type Metadata = {
    [key: string]: string | number | boolean | string[] | number[];
  };
// Base user type for all roles
export type AppUser = {
  readonly id: string; // Unique ID (UUID or MongoDB _id)
  email: string;
  fullname: string;
  role: UserRole; // Determines user capabilities
  passwordHash?: string; // Encrypted password
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string; // Optional: for verification or support
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  isActive?: boolean;
  lastLogin?: string | Date;

  // Address and shipping info
  addresses?: Array<{
    id: string; // Unique ID for the address
    label?: string; // e.g., "Home", "Office"
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;

  // Payment info (optional, can store tokens or last used method)
  paymentMethods?: Array<{
    id: string;
    type: "card" | "paypal" | "bank" | "crypto";
    last4?: string; // For cards
    expiry?: string;
    isDefault?: boolean;
  }>;

  // Vendor-specific info (optional)
  storeName?: string;
  storeDescription?: string;
  storeLogoUrl?: string;

  // Customer-specific info (optional)
  wishlist?: string[]; // Product IDs
  cart?: Array<{
    productId: string;
    quantity: number;
  }>;

  // Admin or analytics metadata
  metadata?: Metadata;
};

export interface UserDropdownProps {
    user: AppUser | null;
}

export type FormState = {
  phone: string;
  countryCode: string;      // ISO code (e.g., "ZA")
  countryName: string;      // Human readable (e.g., "South Africa")
  provinceCode: string;     // ISO code for province/state when available
  provinceName: string;
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
};
