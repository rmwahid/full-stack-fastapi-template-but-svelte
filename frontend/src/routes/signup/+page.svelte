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

	const schema = z.object({
		full_name: z.string().min(1, "Full name is required"),
		email: z.email("Invalid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters"),
	})

	type FormData = z.infer<typeof schema>

	const { signUpMutation } = createAuth()

	const form = superForm<FormData>(defaults(zod4(schema)), {
		validators: zod4(schema),
		onSubmit: ({ formData, cancel }) => {
			cancel()
			if ($signUpMutation.isPending) return
			$signUpMutation.mutate(Object.fromEntries(formData.entries()) as unknown as UserRegister)
		},
	})

	const fd = form.form
</script>

<svelte:head>
	<title>Sign Up - FastAPI Template</title>
</svelte:head>

<AuthLayout>
	<h1 class="mb-4 text-center text-2xl font-bold">Sign Up</h1>
	<form onsubmit={form.submit} method="POST" class="flex flex-col gap-4">
		<Form.Field {form} name="full_name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Full name</Form.Label>
					<Input {...props} bind:value={$fd.full_name} placeholder="Full name" type="text" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs" />
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$fd.email} placeholder="Email" type="email" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs" />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<PasswordInput {...props} bind:value={$fd.password} placeholder="Password" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-xs" />
		</Form.Field>

		<LoadingButton type="submit" loading={$signUpMutation.isPending}>Sign Up</LoadingButton>
		<span class="text-center text-sm">
			Already have an account?
			<a href="/login" class="underline underline-offset-4">Log In</a>
		</span>
	</form>
</AuthLayout>
