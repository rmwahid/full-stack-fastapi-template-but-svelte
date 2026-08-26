const TOKEN_KEY = "access_token";

export function getAccessToken(): string | null {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
	localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
	return getAccessToken() !== null;
}
