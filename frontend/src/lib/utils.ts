import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, "child"> : T;
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};

export function extractErrorMessage(err: unknown): string {
	const detail = (err as { detail?: unknown })?.detail;
	if (Array.isArray(detail) && detail.length > 0) {
		const first = detail[0] as { msg?: string };
		if (first?.msg) return first.msg;
	}
	if (typeof detail === "string") return detail;
	if (err instanceof Error) return err.message;
	return "Something went wrong.";
}

export const handleError = (err: unknown, notify: (msg: string) => void) => {
	notify(extractErrorMessage(err));
};

export const getInitials = (name: string): string => {
	return name
		.split(" ")
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
};
