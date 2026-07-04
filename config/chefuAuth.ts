const CHEFU_ACCOUNT_APP_URL =
    process.env.NEXT_PUBLIC_CHEFU_ACCOUNT_URL ||
    "https://myaccount.chefuinc.com";
const CHEFU_API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.chefuinc.com";
const CHEFU_ACCOUNT_APP_ID = "drippybanks";

function buildChefuAuthUrl(
    path: "/login" | "/register" | "/logout",
    returnTo?: string,
    origin?: string,
) {
    const params = new URLSearchParams({ app: CHEFU_ACCOUNT_APP_ID });
    const resolvedReturnTo = resolveReturnTo(returnTo, origin);

    if (resolvedReturnTo) {
        params.set("returnTo", resolvedReturnTo);
    }

    return `${CHEFU_ACCOUNT_APP_URL}${path}?${params.toString()}`;
}

function resolveReturnTo(returnTo?: string, origin?: string) {
    if (!returnTo) {
        return undefined;
    }

    if (returnTo.startsWith("http://") || returnTo.startsWith("https://")) {
        return returnTo;
    }

    return makeChefuReturnUrl(returnTo, origin);
}

export function apiUrl(path: string) {
    return `${CHEFU_API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildChefuLoginUrl(returnTo?: string, origin?: string) {
    return buildChefuAuthUrl("/login", returnTo, origin);
}

export function buildChefuAuthRedirectUrl(path = "/", origin?: string) {
    return buildChefuLoginUrl(path, origin);
}

export function buildChefuRegisterUrl(returnTo?: string, origin?: string) {
    return buildChefuAuthUrl("/register", returnTo, origin);
}

export function buildChefuLogoutUrl(returnTo?: string, origin?: string) {
    return buildChefuAuthUrl("/logout", returnTo, origin);
}

export function normalizeReturnPath(path: string) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (path.startsWith("/")) {
        return path;
    }

    return `/${path}`;
}

export function makeChefuReturnUrl(path: string, origin?: string) {
    const normalized = normalizeReturnPath(path);

    if (origin && normalized.startsWith("/")) {
        const cleanOrigin = origin.replace(/\/$/, "");
        return `${cleanOrigin}${normalized}`;
    }

    return normalized;
}
