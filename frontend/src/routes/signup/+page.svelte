<script lang="ts">
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import { createAuth } from "$lib/auth.svelte"
	import type { UserRegister } from "$lib/client"
	import AuthLayout from "$lib/components/common/AuthLayout.svelte"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import PasswordInput from "$lib/components/ui/password-input.svelte"

	const schema = z
		.object({
			full_name: z.string().min(1, "Full Name is required"),
			email: z.email("Invalid email address"),
			password: z
				.string()
				.min(1, "Password is required")
				.min(8, "Password must be at least 8 characters"),
			confirm_password: z.string().min(1, "Password confirmation is required"),
		})
		.refine((data) => data.password === data.confirm_password, {
			message: "The passwords don't match",
			path: ["confirm_password"],
		})

	type FormData = z.infer<typeof schema>

	const { signUpMutation } = createAuth()

	const form = superForm<FormData>(defaults(zod4(schema)), {
		validators: zod4(schema),
		SPA: true,
		onUpdate: ({ result }) => {
			if (result.type !== "success") return
			if ($signUpMutation.isPending) return
			$signUpMutation.mutate({
				full_name: $fd.full_name,
				email: $fd.email,
				password: $fd.password,
			} as unknown as UserRegister)
		},
	})

	const fd = form.form
	const errors = form.errors
</script>

<svelte:head>
	<title>Sign Up - FastAPI Template</title>
</svelte:head>

<AuthLayout>
	<h1 class="mb-4 text-center text-2xl font-bold">Create an account</h1>
	<form method="POST" use:form.enhance class="flex flex-col gap-4">
		<Form.Field {form} name="full_name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Full Name</Form.Label>
					<Input {...props} bind:value={$fd.full_name} data-testid="full-name-input" placeholder="User" type="text" />
				{/snippet}
			</Form.Control>
			{#if $errors.full_name}
					<p class="text-xs font-medium text-destructive">{$errors.full_name[0]}</p>
				{/if}
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$fd.email} data-testid="email-input" placeholder="user@example.com" type="email" />
				{/snippet}
			</Form.Control>
			{#if $errors.email}
					<p class="text-xs font-medium text-destructive">{$errors.email[0]}</p>
				{/if}
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.password} data-testid="password-input" placeholder="Password" />
				{/snippet}
			</Form.Control>
			{#if $errors.password}
					<p class="text-xs font-medium text-destructive">{$errors.password[0]}</p>
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

		<LoadingButton type="submit" loading={$signUpMutation.isPending}>Sign Up</LoadingButton>
		<span class="text-center text-sm">
			Already have an account?
			<a href="/login" class="underline underline-offset-4">Log In</a>
		</span>
	</form>
</AuthLayout>
