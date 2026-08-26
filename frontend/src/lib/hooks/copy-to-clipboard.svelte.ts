export function createCopyToClipboard() {
	let copiedText = $state<string | null>(null);

	async function copy(text: string) {
		await navigator.clipboard.writeText(text);
		copiedText = text;
	}

	return {
		get copiedText() {
			return copiedText;
		},
		copy,
	};
}
