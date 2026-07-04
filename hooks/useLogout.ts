import { apiUrl, buildChefuLogoutUrl, makeChefuReturnUrl } from "@/config/chefuAuth";

export const useLogout = () => {
    const handleLogout = async (redirectTo?: string) => {
        try {
            await fetch(apiUrl("/auth/session"), {
                method: "DELETE",
                credentials: "include",
            });
        } catch (error) {
            console.warn("Shared session clear failed, continuing to central logout.", error);
        } finally {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const returnTo = redirectTo
                ? makeChefuReturnUrl(redirectTo, origin)
                : makeChefuReturnUrl("/", origin);

            window.location.assign(buildChefuLogoutUrl(returnTo));
        }
    };

    return { handleLogout };
};
