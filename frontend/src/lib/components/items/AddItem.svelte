<script lang="ts">
	import { createMutation, useQueryClient } from "@tanstack/svelte-query"
	import { z } from "zod"
	import { defaults, superForm } from "sveltekit-superforms"
	import { zod4 } from "sveltekit-superforms/adapters"
	import Plus from "@lucide/svelte/icons/plus"

	import type { ItemCreate } from "$lib/client"
	import { ItemsService } from "$lib/client"
	import { Button } from "$lib/components/ui/button"
	import * as Dialog from "$lib/components/ui/dialog"
	import * as Form from "$lib/components/ui/form"
	import Input from "$lib/components/ui/input/input.svelte"
	import LoadingButton from "$lib/components/ui/loading-button.svelte"
	import { showErrorToast, showSuccessToast } from "$lib/toast"
	import { handleError } from "$lib/utils"

	const schema = z.object({
		title: z.string().min(1, "Title is required"),
		description: z.string().optional(),
	})

	type FormData = z.infer<typeof schema>

	let open = $state(false)
	const queryClient = useQueryClient()

	const mutation = createMutation({
		mutationFn: (data: ItemCreate) => ItemsService.createItem({ body: data }),
		onSuccess: () => {
			showSuccessToast("Item created successfully")
			form.reset()
			open = false
		},
		onError: (error) => handleError(error, showErrorToast),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
	})

	const form = superForm<FormData>(defaults(zod4(schema)), {
		id: "add-item",
		validators: zod4(schema),
		SPA: true,
		onUpdate: ({ result }) => {
			if (result.type !== "success") return
			if ($mutation.isPending) return
			$mutation.mutate({
				title: $fd.title,
				description: $fd.description ?? "",
			} as unknown as ItemCreate)
		},
	})

	const fd = form.form
	const errors = form.errors
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
		<Button {...props} class="my-4">
			<Plus class="mr-2" />
			Add Item
		</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Item</Dialog.Title>
			<Dialog.Description>Fill in the details to add a new item.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:form.enhance>
			<div class="grid gap-4 py-4">
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Title <span class="text-destructive">*</span></Form.Label>
							<Input {...props} bind:value={$fd.title} onblur={() => form.validate("title")} placeholder="Title" type="text" />
						{/snippet}
					</Form.Control>
					{#if $errors.title}
						<p class="text-xs font-medium text-destructive">{$errors.title[0]}</p>
					{/if}
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Description</Form.Label>
							<Input {...props} bind:value={$fd.description} placeholder="Description" type="text" />
						{/snippet}
					</Form.Control>
					{#if $errors.description}
						<p class="text-xs font-medium text-destructive">{$errors.description[0]}</p>
					{/if}
				</Form.Field>
			</div>

			<Dialog.Footer>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button {...props} variant="outline" disabled={$mutation.isPending}>Cancel</Button>
					{/snippet}
				</Dialog.Close>
				<LoadingButton type="submit" loading={$mutation.isPending}>Save</LoadingButton>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
