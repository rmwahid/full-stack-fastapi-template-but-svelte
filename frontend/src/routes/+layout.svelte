<script lang="ts">
	import "../app.css"
	import {
		MutationCache,
		QueryCache,
		QueryClient,
		QueryClientProvider,
	} from "@tanstack/svelte-query"
	import { ModeWatcher } from "mode-watcher"
	import { Toaster } from "$lib/components/ui/sonner";

	import { client } from "$lib/client/client.gen"
	import { clearAccessToken, getAccessToken } from "$lib/token"
	import { handleError } from "$lib/utils"
	import { showErrorToast } from "$lib/toast"

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

	client.interceptors.error.use((error, response) => {
		const status = response?.status ?? 0
		if ((status === 401 || status === 403) && getAccessToken() !== null) {
			clearAccessToken()
			window.location.href = "/login"
		}
		return error
	})

	function handleApiError(error: unknown) {
		handleError(error, showErrorToast)
	}

	const queryClient = new QueryClient({
		queryCache: new QueryCache({ onError: handleApiError }),
		mutationCache: new MutationCache({ onError: handleApiError }),
	})

	let { children } = $props()
</script>

<ModeWatcher defaultMode="dark" />

<QueryClientProvider client={queryClient}>
	<Toaster richColors closeButton />
	{@render children()}
</QueryClientProvider>
