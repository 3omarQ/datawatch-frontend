const ACCESS_TOKEN_COOKIE = "accessToken";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function setAuthSession(accessToken: string, user: unknown) {
  if (typeof window === "undefined") return;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${accessToken}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function redirectToSignIn() {
  if (typeof window === "undefined") return;

  const next = `${window.location.pathname}${window.location.search}`;
  const signInUrl = next && next !== "/sign-in"
    ? `/sign-in?next=${encodeURIComponent(next)}`
    : "/sign-in";

  window.location.assign(signInUrl);
}
