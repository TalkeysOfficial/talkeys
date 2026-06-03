const ACCESS_TOKEN_KEY = "accessToken";
const NAME_KEY = "name";

const isBrowser = () => typeof window !== "undefined";

const decodeBase64Url = (value: string) => {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
	return window.atob(padded);
};

export const isStoredTokenUsable = (token: string | null | undefined) => {
	const normalizedToken = token?.trim();

	if (
		!normalizedToken ||
		normalizedToken === "null" ||
		normalizedToken === "undefined"
	) {
		return false;
	}

	const [, payload] = normalizedToken.split(".");
	if (!payload || normalizedToken.split(".").length !== 3 || !isBrowser()) {
		return false;
	}

	try {
		const decoded = JSON.parse(decodeBase64Url(payload));
		return !decoded.exp || decoded.exp * 1000 > Date.now();
	} catch {
		return false;
	}
};

export const clearStoredAuth = () => {
	if (!isBrowser()) return;
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(NAME_KEY);
};

export const getStoredAccessToken = () => {
	if (!isBrowser()) return null;

	const token = localStorage.getItem(ACCESS_TOKEN_KEY);
	if (!isStoredTokenUsable(token)) {
		clearStoredAuth();
		return null;
	}

	return token;
};

export const isAuthFailure = (error: unknown) => {
	const apiError = error as { status?: number; message?: string; error?: string };
	const status = Number(apiError?.status);
	const message = `${apiError?.message || ""} ${apiError?.error || ""}`;

	return (
		status === 401 ||
		status === 403 ||
		/token|auth|login|verified/i.test(message)
	);
};
