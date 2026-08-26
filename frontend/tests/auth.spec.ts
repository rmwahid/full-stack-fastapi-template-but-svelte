import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
	test("renders login form", async ({ page }) => {
		await page.goto("/login");
		await expect(page.getByRole("heading", { name: "Login to your account" })).toBeVisible();
		await expect(page.getByTestId("email-input")).toBeVisible();
		await expect(page.getByTestId("password-input")).toBeVisible();
		await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
	});

	test("shows validation error for invalid email", async ({ page }) => {
		await page.goto("/login");
		await page.getByTestId("email-input").fill("not-an-email");
		await page.getByTestId("password-input").fill("password123");
		await page.getByRole("button", { name: "Log In" }).click();
		await expect(page.getByText("Invalid email address")).toBeVisible();
	});

	test("links to signup and recover password", async ({ page }) => {
		await page.goto("/login");
		await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
		await expect(page.getByRole("link", { name: "Forgot your password?" })).toBeVisible();
	});
});

test.describe("Signup page", () => {
	test("renders signup form", async ({ page }) => {
		await page.goto("/signup");
		await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();
		await expect(page.getByPlaceholder("Full name")).toBeVisible();
		await expect(page.getByPlaceholder("Email")).toBeVisible();
	});

	test("redirects to login after navigating from protected route when logged out", async ({
		page,
	}) => {
		await page.goto("/items");
		await page.waitForURL("**/login**");
		expect(page.url()).toContain("/login");
	});
});
