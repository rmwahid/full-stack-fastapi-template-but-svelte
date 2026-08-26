import { toast } from "svelte-sonner";

export const showSuccessToast = (description: string) => {
	toast.success("Success!", { description });
};

export const showErrorToast = (description: string) => {
	toast.error("Something went wrong!", { description });
};
