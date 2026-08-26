import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: "index.html",
			pages: "../backend/app/frontend",
			assets: "../backend/app/frontend",
		}),
		files: {
			assets: "public",
		},
	},
};

export default config;
