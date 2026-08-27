import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 6173,
		proxy: {
			// Dev convenience: forward API calls to the compose backend so no
			// CORS setup is needed when running the UI outside the container.
			"/api": "http://localhost:8000",
		},
	},
});
