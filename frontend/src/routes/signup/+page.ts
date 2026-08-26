import { redirect } from "@sveltejs/kit";
import { isLoggedIn } from "$lib/token";

export const load = () => {
	if (isLoggedIn()) {
		redirect(302, "/");
	}
};
