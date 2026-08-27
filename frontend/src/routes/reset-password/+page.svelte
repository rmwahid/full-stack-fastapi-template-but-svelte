<script lang="ts">
	import { z } from "zod"
	import { createMutation } from "@tanstack/svelte-query"
	import { goto } from "$app/navigation"
	import { page } from "$app/state"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { NewPassword } from "$lib/client"
	import { LoginService } from "$lib/client"
	import AuthLayout from "$lib/components/common/AuthLayout.svelte"
	import * as Form from "$lib/components/ui/form"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import PasswordInput from "$lib/components/ui/password-input.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const token = $derived(page.url.searchParams.get("token") ?? "")

	const schema = z
		.object({
			new_password: z
				.string()
				.min(1, "Password is required")
				.min(8, "Password must be at least 8 characters"),
			confirm_password: z.string().min(1, "Password confirmation is required"),
		})
		.refine((data) => data.new_password === data.confirm_password, {
			message: "Passwords do not match",
			path: ["confirm_password"],
		})

	type FormData = z.infer<typeof schema>

	const resetPassword = createMutation({
		mutationFn: (data: NewPassword) => LoginService.resetPassword({ body: data }),
		onSuccess: () => {
			showSuccessToast("Password updated successfully.")
			goto("/login")
		},
		onError: (error) => handleError(error, showErrorToast),
	})

	const form = superForm<FormData>(defaults(zod4(schema)), {
		validators: zod4(schema),
		SPA: true,
		onUpdate: ({ result }) => {
			if (result.type !== "success") return
			if ($resetPassword.isPending) return
			$resetPassword.mutate({ new_password: $fd.new_password, token })
		},
	})

	const fd = form.form
	const errors = form.errors
</script>

<svelte:head>
	<title>Reset Password - FastAPI Template</title>
</svelte:head>

<AuthLayout>
	<form method="POST" use:form.enhance class="flex flex-col gap-4">
		<h1 class="text-center text-2xl font-bold">Reset Password</h1>
		<p class="text-muted-foreground -mt-3 text-center text-sm">
			Please enter your new password below.
		</p>

		<Form.Field {form} name="new_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>New Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.new_password} data-testid="new-password-input" placeholder="New Password" />
				{/snippet}
			</Form.Control>
			{#if $errors.new_password}
					<p class="text-xs font-medium text-destructive">{$errors.new_password[0]}</p>
				{/if}
		</Form.Field>

		<Form.Field {form} name="confirm_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.confirm_password} data-testid="confirm-password-input" placeholder="Confirm Password" />
				{/snippet}
			</Form.Control>
			{#if $errors.confirm_password}
					<p class="text-xs font-medium text-destructive">{$errors.confirm_password[0]}</p>
				{/if}
		</Form.Field>

		{#if !token}
			<p class="text-destructive text-sm">
				Missing or invalid reset token. Please request a new recovery email.
			</p>
		{/if}

		<LoadingButton type="submit" loading={$resetPassword.isPending} disabled={!token}>Reset Password</LoadingButton>
	</form>
</AuthLayout>
