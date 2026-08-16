import { useEffect, useState } from "react";
import type { AppUser } from "@/types/user";
import { apiUrl } from "@/config/chefuAuth";

export function useAuthUser() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let canceled = false;

        async function checkSession() {
            console.debug("[useAuthUser] checking backend session via /auth/me");
            try {
                setLoading(true);
                const res = await fetch(apiUrl("/auth/me"), {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) {
                    console.debug("[useAuthUser] /auth/me returned not ok", res.status);
                    if (!canceled) setUser(null);
                    return;
                }

                const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
                const sessionUser = (data?.user ?? data) as Record<string, unknown> | null;

                if (!sessionUser || !sessionUser.email) {
                    console.debug("[useAuthUser] no session user in response");
                    if (!canceled) setUser(null);
                    return;
                }

                const email = String(sessionUser.email);
                const rawRoles = Array.isArray(sessionUser.roles)
                    ? sessionUser.roles
                    : typeof sessionUser.role === "string"
                      ? [sessionUser.role]
                      : [];
                const profile = data?.profile as Record<string, unknown> | undefined;
                const profileRoles = Array.isArray(profile?.roles)
                    ? profile.roles
                    : typeof profile?.role === "string"
                      ? [profile.role]
                      : [];
                const allRoles = [...rawRoles, ...profileRoles].map((r) => String(r).toLowerCase());
                const isAdminUser = allRoles.includes("admin");

                const profileCountry = (profile?.country as AppUser["country"]) || undefined;
                const appUser: AppUser = {
                    id: String(sessionUser.uid || sessionUser.id || sessionUser.userId || email),
                    email,
                    fullname: String(sessionUser.fullname || sessionUser.name || sessionUser.displayName || profile?.name || email.split("@")[0]),
                    role: isAdminUser ? "admin" : "customer",
                    addressCity: String(sessionUser.addressCity || profile?.addressCity || ""),
                    addressStreet: String(sessionUser.addressStreet || profile?.addressStreet || ""),
                    addressPostalCode: String(sessionUser.addressPostalCode || profile?.addressPostalCode || ""),
                    country: (sessionUser.country as AppUser["country"]) || profileCountry || undefined,
                    avatarUrl: sessionUser.avatarUrl ? String(sessionUser.avatarUrl) : profile?.avatarUrl ? String(profile.avatarUrl) : undefined,
                    phone: sessionUser.phone ? String(sessionUser.phone) : sessionUser.phoneNumber ? String(sessionUser.phoneNumber) : profile?.phone ? String(profile.phone) : undefined,
                    isEmailVerified: Boolean(sessionUser.isEmailVerified),
                    isPhoneVerified: Boolean(sessionUser.isPhoneVerified),
                    createdAt: sessionUser.createdAt ? new Date(sessionUser.createdAt as string | number) : new Date(),
                    storeName: profile?.storeName ? String(profile.storeName) : undefined,
                    storeDescription: profile?.storeDescription ? String(profile.storeDescription) : undefined,
                };

                console.debug("[useAuthUser] session user loaded", appUser);
                if (!canceled) setUser(appUser);
            } catch (err) {
                console.error("[useAuthUser] error checking session", err);
                if (!canceled) setUser(null);
            } finally {
                if (!canceled) setLoading(false);
            }
        }

        void checkSession();

        const handleFocus = () => {
            void checkSession();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                void checkSession();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            canceled = true;
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return { user, loading };
}
