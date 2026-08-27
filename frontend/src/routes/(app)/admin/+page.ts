import { redirect } from "@sveltejs/kit";
import { UsersService } from "$lib/client";
import { isLoggedIn } from "$lib/token";

export const load = async () => {
	if (!isLoggedIn()) {
		redirect(302, "/login");
	}
	const res = await UsersService.readUserMe().catch(() => null);
	if (!res?.data) {
		redirect(302, "/login");
	}
	if (!res.data.is_superuser) {
		redirect(302, "/");
	}
};
