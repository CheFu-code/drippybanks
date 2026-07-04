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

                const data = (await res.json().catch(() => null)) as any;
                const sessionUser = data?.user ?? data;

                if (!sessionUser || !sessionUser.email) {
                    console.debug("[useAuthUser] no session user in response");
                    if (!canceled) setUser(null);
                    return;
                }

                const appUser: AppUser = {
                    id: sessionUser.uid ?? sessionUser.id ?? sessionUser.userId,
                    email: sessionUser.email,
                    fullname: sessionUser.fullname ?? sessionUser.name ?? sessionUser.displayName ?? sessionUser.email.split("@")[0],
                    role: sessionUser.role ?? "customer",
                    addressCity: sessionUser.addressCity ?? "",
                    addressStreet: sessionUser.addressStreet ?? "",
                    addressPostalCode: sessionUser.addressPostalCode ?? "",
                    country: sessionUser.country ?? null,
                    avatarUrl: sessionUser.avatarUrl ?? undefined,
                    phone: sessionUser.phone ?? sessionUser.phoneNumber ?? undefined,
                    isEmailVerified: sessionUser.isEmailVerified ?? false,
                    isPhoneVerified: sessionUser.isPhoneVerified ?? false,
                    createdAt: sessionUser.createdAt ? new Date(sessionUser.createdAt) : new Date(),
                } as AppUser;

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
