import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";
import { goto } from "$app/navigation";

import {
	type Body_login_login_access_token,
	LoginService,
	type UserPublic,
	type UserRegister,
	UsersService,
} from "$lib/client";
import { showErrorToast } from "$lib/toast";
import { clearAccessToken, isLoggedIn, setAccessToken } from "$lib/token";
import { handleError } from "$lib/utils";

export { isLoggedIn };

export function createAuth() {
	const queryClient = useQueryClient();

	const user = createQuery<UserPublic | null>({
		queryKey: ["currentUser"],
		queryFn: async () => (await UsersService.readUserMe()).data,
		enabled: isLoggedIn(),
	});

	const signUpMutation = createMutation({
		mutationFn: (data: UserRegister) => UsersService.registerUser({ body: data }),
		onSuccess: () => goto("/login"),
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	});

	const login = async (data: Body_login_login_access_token) => {
		const response = await LoginService.loginAccessToken({ body: data });
		setAccessToken(response.data.access_token);
	};

	const loginMutation = createMutation({
		mutationFn: login,
		onSuccess: () => goto("/"),
		onError: (error) => handleError(error, showErrorToast),
	});

	const logout = () => {
		clearAccessToken();
		queryClient.clear();
		goto("/login");
	};

	return {
		signUpMutation,
		loginMutation,
		logout,
		user,
	};
}
