import { client } from "$lib/client/client.gen"
import { clearAccessToken, getAccessToken } from "$lib/token"

// Client bootstrap must run before any child load function fires,
// so authenticated requests include the Authorization header.
client.setConfig({
	baseUrl: import.meta.env.VITE_API_URL ?? "",
})

client.interceptors.request.use((request) => {
	const token = getAccessToken()
	if (token) {
		request.headers.set("Authorization", `Bearer ${token}`)
	}
	return request
})

// The vendored hey-api client throws the parsed response body as the error,
// so the HTTP status is only available through the error interceptor.
client.interceptors.error.use((error, response) => {
	const status = response?.status ?? 0
	if ((status === 401 || status === 403) && getAccessToken() !== null) {
		clearAccessToken()
		window.location.href = "/login"
	}
	return error
})

export const ssr = false;
export const prerender = false;
