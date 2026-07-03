const CHEFU_ACCOUNT_APP_URL =
    process.env.NEXT_PUBLIC_CHEFU_ACCOUNT_URL ||
    "https://myaccount.chefuinc.com";
const CHEFU_ACCOUNT_APP_ID = "drippybanks";

function buildChefuAuthUrl(path: "/login" | "/register", returnTo?: string) {
    const params = new URLSearchParams({ app: CHEFU_ACCOUNT_APP_ID });

    if (returnTo) {
        params.set("returnTo", returnTo);
    }

    return `${CHEFU_ACCOUNT_APP_URL}${path}?${params.toString()}`;
}

export function buildChefuLoginUrl(returnTo?: string) {
    return buildChefuAuthUrl("/login", returnTo);
}

export function buildChefuRegisterUrl(returnTo?: string) {
    return buildChefuAuthUrl("/register", returnTo);
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
