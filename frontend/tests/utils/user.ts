import { expect, type Page } from "@playwright/test"

export async function waitForApp(page: Page) {
	await page.waitForSelector('html[data-hydrated="true"]')
}

export async function signUpNewUser(
	page: Page,
	name: string,
	email: string,
	password: string,
) {
	await page.goto("/signup")
	await waitForApp(page)

	await page.getByTestId("full-name-input").fill(name)
	await page.getByTestId("email-input").fill(email)
	await page.getByTestId("password-input").fill(password)
	await page.getByTestId("confirm-password-input").fill(password)
	await page.getByRole("button", { name: "Sign Up" }).click()
	await page.goto("/login")
	await waitForApp(page)
}

export async function logInUser(page: Page, email: string, password: string) {
	await page.goto("/login")
	await waitForApp(page)

	await page.getByTestId("email-input").fill(email)
	await page.getByTestId("password-input").fill(password)
	await page.getByRole("button", { name: "Log In" }).click()
	await page.waitForURL("/")
	await expect(
		page.getByText("Welcome back, nice to see you again!"),
	).toBeVisible()
}

export async function logOutUser(page: Page) {
	await page.getByTestId("user-menu").click()
	await page.getByRole("menuitem", { name: "Log Out" }).click()
	await page.waitForURL("/login")
}
