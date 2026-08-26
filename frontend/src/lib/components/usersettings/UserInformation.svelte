<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UserPublic, UserUpdateMe } from "$lib/client"
	import { UsersService } from "$lib/client"
	import * as Card from "$lib/components/ui/card"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		full_name: z.string(),
		email: z.email("Invalid email address"),
	})

	type FormData = z.infer<typeof schema>

	let { user }: { user: UserPublic } = $props();

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: UserUpdateMe) => UsersService.updateUserMe({ body: data }),
		onSuccess: () => showSuccessToast("User updated successfully"),
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries(),
	})

	const form = superForm<FormData>(
		defaults({ full_name: user.full_name ?? "", email: user.email }, zod4(schema)),
		{
			validators: zod4(schema),
			onSubmit: ({ formData, cancel }) => {
				cancel()
				if ($mutation.isPending) return
				const entries = Object.fromEntries(formData.entries()) as Record<string, string>
				$mutation.mutate({ full_name: entries.full_name ?? "", email: entries.email ?? "" })
			},
		},
	)

	const fd = form.form
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>User Information</Card.Title>
		<Card.Description>Update your account information</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={form.submit} method="POST" class="flex flex-col gap-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} bind:value={$fd.email} placeholder="Email" type="email" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<Form.Field {form} name="full_name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full name</Form.Label>
						<Input {...props} bind:value={$fd.full_name} placeholder="Full name" type="text" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-xs" />
			</Form.Field>

			<div class="flex justify-between">
				<a href="/" class="text-sm underline underline-offset-4">Back to dashboard</a>
				<LoadingButton type="submit" loading={$mutation.isPending}>Save</LoadingButton>
			</div>
		</form>
	</Card.Content>
</Card.Root>
