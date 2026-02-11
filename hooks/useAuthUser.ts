import { doc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import type { AppUser } from "@/types/user";

export function useAuthUser() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (!firebaseUser?.uid || !firebaseUser.email) {
                    setUser(null);
                    return;
                }

                const ref = doc(db, "drippy-banks-users", firebaseUser.uid); // ✅ ensure correct collection name
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const data = snap.data();

                    // ✅ Normalize dates if they are Firestore Timestamps

                    const coerceDate = (v: unknown): Date | null => {
                        if (v instanceof Timestamp) {
                            return v.toDate();
                        }

                        if (v instanceof Date) {
                            return v;
                        }

                        return null;
                    };

                    const appUser: AppUser = {
                        id: ref.id, // ✅ inject the doc id
                        email: data.email ?? firebaseUser.email, // fallback to auth email
                        fullname:
                            data.fullname ??
                            firebaseUser.displayName ??
                            firebaseUser.email.split("@")[0],
                        role: (data.role as AppUser["role"]) ?? "customer",

                        addressCity: data.addressCity ?? "",
                        addressStreet: data.addressStreet ?? "",
                        addressPostalCode: data.addressPostalCode ?? "",
                        country: data.country ?? null,

                        // Optional fields with safe mapping
                        avatarUrl: data.avatarUrl ?? undefined,
                        phoneNumber: data.phoneNumber ?? data.phone ?? undefined, // ✅ map phone → phoneNumber if needed
                        isEmailVerified:
                            data.isEmailVerified ?? firebaseUser.emailVerified ?? false,
                        isPhoneVerified: data.isPhoneVerified ?? false,

                        createdAt: coerceDate(data.createdAt) ?? new Date(),
                        updatedAt: coerceDate(data.updatedAt) ?? undefined,
                        lastLogin: coerceDate(data.lastLogin) ?? undefined,

                        // Address / payments (if you store them)
                        paymentMethods: data.paymentMethods ?? undefined,

                        // Vendor fields
                        storeName: data.storeName ?? undefined,
                        storeDescription: data.storeDescription ?? undefined,
                        storeLogoUrl: data.storeLogoUrl ?? undefined,

                        // Customer fields
                        wishlist: data.wishlist ?? undefined,
                        cart: data.cart ?? undefined,

                        metadata: data.metadata ?? undefined,
                    };

                    setUser(appUser);
                } else {
                    // Fallback for brand-new users without a profile doc
                    setUser({
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        fullname:
                            firebaseUser.displayName ?? firebaseUser.email.split("@")[0],
                        role: "guest",
                        createdAt: new Date(),
                    });
                }
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    return { user, loading };
}
