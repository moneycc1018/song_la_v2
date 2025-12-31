import { expect, test } from "@playwright/test";

test.describe("Login Page", () => {
  // before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
    // wait for page to load
    await page.waitForURL(/\/login$/);
  });

  test("test: display login card with correct elements", async ({ page }) => {
    await expect(page.getByText("Song La")).toBeVisible(); // test title exists
    await expect(page.getByRole("button", { name: "Log in with Google" })).toBeVisible(); // test login button exists
  });

  test("test: navigate to playground page when guest login is clicked", async ({ page }) => {
    const guestBtn = page.getByRole("link", { name: "Continue as Guest" });
    await expect(guestBtn).toBeVisible(); // test guest login button exists
    await guestBtn.click();

    await expect(page).toHaveURL(/\/playground$/); // test page navigation
  });
});
