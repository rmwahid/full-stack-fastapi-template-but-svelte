<script lang="ts">
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import { createAuth } from "$lib/auth.svelte"
	import type { Body_login_login_access_token } from "$lib/client"
	import AuthLayout from "$lib/components/common/AuthLayout.svelte"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import PasswordInput from "$lib/components/ui/password-input.svelte"

	const schema = z.object({
		username: z.email("Invalid email address"),
		password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
	})

	type FormData = z.infer<typeof schema>

	const auth = createAuth()
	const loginMutation = auth.loginMutation

	const form = superForm<FormData>(defaults(zod4(schema)), {
		validators: zod4(schema),
		onSubmit: ({ formData, cancel }) => {
			cancel()
			if ($loginMutation.isPending) return
			$loginMutation.mutate(Object.fromEntries(formData.entries()) as unknown as Body_login_login_access_token)
		},
	})

	const fd = form.form
</script>

<svelte:head>
	<title>Log In - FastAPI Template</title>
</svelte:head>

<AuthLayout>
	<form onsubmit={form.submit} method="POST" class="flex flex-col gap-6">
		<div class="flex flex-col items-center gap-2 text-center">
			<h1 class="text-2xl font-bold">Login to your account</h1>
		</div>

		<div class="grid gap-4">
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$fd.username} data-testid="email-input" placeholder="user@example.com" type="email" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<div class="flex items-center">
							<Form.Label>Password</Form.Label>
							<a href="/recover-password" class="ml-auto text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<PasswordInput {...props} bind:value={$fd.password} data-testid="password-input" placeholder="Password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<LoadingButton type="submit" loading={$loginMutation.isPending}>Log In</LoadingButton>
		</div>

		<div class="text-center text-sm">
			Don't have an account yet?
			<a href="/signup" class="underline underline-offset-4">Sign up</a>
		</div>
	</form>
</AuthLayout>
