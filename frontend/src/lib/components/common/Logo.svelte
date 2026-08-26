<script lang="ts">
	import { mode } from "mode-watcher";
	import { cn } from "$lib/utils";

	interface Props {
		variant?: "full" | "icon" | "responsive";
		className?: string;
		asLink?: boolean;
	}

	let { variant = "full", className, asLink = true }: Props = $props();

	const isDark = $derived(mode.current === "dark");

	const fullLogo = $derived(isDark ? "/assets/images/fastapi-logo-light.svg" : "/assets/images/fastapi-logo.svg");
	const iconLogo = $derived(isDark ? "/assets/images/fastapi-icon-light.svg" : "/assets/images/fastapi-icon.svg");
</script>

{#snippet content()}
	{#if variant === "responsive"}
		<img src={fullLogo} alt="FastAPI" class={cn("h-6 w-auto group-data-[collapsible=icon]:hidden", className)} />
		<img src={iconLogo} alt="FastAPI" class={cn("hidden size-5 group-data-[collapsible=icon]:block", className)} />
	{:else if variant === "full"}
		<img src={fullLogo} alt="FastAPI" class={cn("h-6 w-auto", className)} />
	{:else}
		<img src={iconLogo} alt="FastAPI" class={cn("size-5", className)} />
	{/if}
{/snippet}

{#if asLink}
	<a href="/">{@render content()}</a>
{:else}
	{@render content()}
{/if}
