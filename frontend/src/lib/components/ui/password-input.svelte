<script lang="ts">
	import EyeOff from "@lucide/svelte/icons/eye-off";
	import Eye from "@lucide/svelte/icons/eye";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: Omit<HTMLInputAttributes, "type"> & {
		ref?: HTMLInputElement | null;
		value?: string;
	} = $props();

	let showPassword = $state(false);
</script>

<div class="relative">
	<input
		bind:this={ref}
		bind:value
		data-slot="input"
		class={cn(
			"h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 w-full min-w-0 outline-none pr-10",
			className
		)}
		type={showPassword ? "text" : "password"}
		{...restProps}
	/>
	<button
		type="button"
		tabindex={-1}
		class="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center"
		onclick={() => (showPassword = !showPassword)}
	>
		{#if showPassword}
			<EyeOff class="size-4" />
		{:else}
			<Eye class="size-4" />
		{/if}
		<span class="sr-only">Toggle password visibility</span>
	</button>
</div>
