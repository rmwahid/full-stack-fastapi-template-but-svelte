<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"

	import type { UserPublic, UserUpdateMe } from "$lib/client"
	import { UsersService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
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

	let editing = $state(false)

	let { user }: { user: UserPublic } = $props();

	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: UserUpdateMe) => UsersService.updateUserMe({ body: data }),
		onSuccess: () => {
			showSuccessToast("User updated successfully")
			editing = false
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries(),
	})

	const form = superForm<FormData>(
		defaults({ full_name: user.full_name ?? "", email: user.email }, zod4(schema)),
		{
			validators: zod4(schema),
			SPA: true,
			onUpdate: ({ result }) => {
				if (result.type !== "success") return
				if ($mutation.isPending) return
				$mutation.mutate({
					full_name: $fd.full_name ?? "",
					email: $fd.email,
				})
			},
		},
	)

	const fd = form.form

	function startEdit() {
		form.reset({ newState: { full_name: user.full_name ?? "", email: user.email } })
		editing = true
	}

	function cancelEdit() {
		form.reset({ newState: { full_name: user.full_name ?? "", email: user.email } })
		editing = false
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>User Information</Card.Title>
		<Card.Description>Update your account information</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" use:form.enhance class="flex flex-col gap-4">
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						{#if editing}
							<Input {...props} bind:value={$fd.email} placeholder="Email" type="email" />
							<Form.FieldErrors class="text-xs" />
						{:else}
							<p class="py-2">{user.email}</p>
						{/if}
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="full_name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Full name</Form.Label>
						{#if editing}
							<Input {...props} bind:value={$fd.full_name} placeholder="Full name" type="text" />
							<Form.FieldErrors class="text-xs" />
						{:else}
							<p class="py-2">{user.full_name}</p>
						{/if}
					{/snippet}
				</Form.Control>
			</Form.Field>

			<div class="flex items-center gap-2">
				{#if editing}
					<Button type="button" variant="outline" onclick={cancelEdit} disabled={$mutation.isPending}>
						Cancel
					</Button>
					<LoadingButton type="submit" loading={$mutation.isPending}>Save</LoadingButton>
				{:else}
					<a href="/" class="mr-auto text-sm underline underline-offset-4">Back to dashboard</a>
					<Button type="button" onclick={startEdit}>Edit</Button>
				{/if}
			</div>
		</form>
	</Card.Content>
</Card.Root>
