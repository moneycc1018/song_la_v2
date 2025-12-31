import { expect, test } from "@playwright/test";

test.describe("Playground Page", () => {
  // before each test (Mock api route)
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/ytmusic/tracks?**", async (route) => {
      const json = [
        {
          video_id: "test-video-1",
          track_name: "Mocked Track 1",
          artists: [{ id: "artist1", name: "Mocked Artist 1" }],
          album: { id: "album1", name: "Mocked Album 1" },
          tags: [{ id: 1, name: "Rock" }],
        },
        {
          video_id: "test-video-2",
          track_name: "Mocked Track 2",
          artists: [{ id: "artist2", name: "Mocked Artist 2" }],
          album: { id: "album2", name: "Mocked Album 2" },
          tags: [{ id: 2, name: "Pop" }],
        },
      ];
      await route.fulfill({ json });
    });

    await page.goto("/en/playground");
  });

  test("test: UI interactions using existing data", async ({ page }) => {
    // start button
    const startBtn = page.getByRole("button", { name: "Start" });
    await expect(startBtn).toBeVisible(); // test start button exists
    await startBtn.click();

    const toastText = page.locator("[data-sonner-toast] [data-title]");
    await expect(toastText).toHaveText("Please select at least one artist or tag."); // test warning

    // artist area
    const artistCard = page.locator(".grid > div").first();
    await expect(artistCard).toHaveText(/Select Artists/i); // test artist card exists

    const artistInput = artistCard.locator("input");
    await artistInput.click();

    const dropdownItems = artistCard.locator("[class*='absolute'] [class*='cursor-pointer']");
    const itemCount = await dropdownItems.count();
    if (itemCount > 0) {
      console.log(`Found ${itemCount} artists. Testing selection...`);

      const firstItem = dropdownItems.first(); // first artist of dropdown list
      const firstItemName = await firstItem.textContent();
      await firstItem.click();

      const artistBadges = artistCard.locator("[data-slot='badge']");
      await expect(artistBadges).toHaveCount(1); // test badge exists
      await expect(artistBadges.first()).toContainText(firstItemName || ""); // test badge text equals to first artist name

      const artistSelectAllBtn = artistCard.getByRole("button", { name: "Select All" });
      await artistSelectAllBtn.click();
      await expect(artistBadges).toHaveCount(itemCount); // test badge count after select all

      const artistRemoveAllBtn = artistCard.getByRole("button", { name: "Remove All" });
      await artistRemoveAllBtn.click();
      await expect(artistBadges).toHaveCount(0); // test badge count after remove all

      await artistInput.click();
      await dropdownItems.first().click();
    } else {
      console.log("No artists found in local database. Skipping selection tests.");
    }

    // tag area
    const tagCard = page.locator(".grid > div").last();
    await expect(tagCard).toContainText(/Select Tags/i); // test tag card exists

    const tagInput = tagCard.locator("input");
    await tagInput.click();

    const tagDropdownItems = tagCard.locator("[class*='absolute'] [class*='cursor-pointer']");
    const tagItemCount = await tagDropdownItems.count();
    if (tagItemCount > 0) {
      console.log(`Found ${tagItemCount} tags. Testing selection...`);

      const firstTagItem = tagDropdownItems.first(); // first tag of dropdown list
      const firstTagItemName = await firstTagItem.textContent();
      await firstTagItem.click();

      const tagBadges = tagCard.locator("[data-slot='badge']");
      await expect(tagBadges).toHaveCount(1); // test badge exists
      await expect(tagBadges.first()).toContainText(firstTagItemName || ""); // test badge text equals to first tag name

      const tagSelectAllBtn = tagCard.getByRole("button", { name: "Select All" });
      await tagSelectAllBtn.click();
      await expect(tagBadges).toHaveCount(tagItemCount); // test badge count after select all

      const tagRemoveAllBtn = tagCard.getByRole("button", { name: "Remove All" });
      await tagRemoveAllBtn.click();
      await expect(tagBadges).toHaveCount(0); // test badge count after remove all

      await tagInput.click();
      await tagDropdownItems.first().click();
    } else {
      console.log("No tags found in local database. Skipping tag selection tests.");
    }

    // game area
    await startBtn.click();

    if (itemCount > 0 || tagItemCount > 0) {
      const answerBtn = page.getByRole("button", { name: "Answer" });
      await expect(answerBtn).toBeVisible(); // test answer button exists

      await answerBtn.click();
      await expect(page.getByText(/Mocked Track/)).toBeVisible(); // test answer of first track

      const nextBtn = page.getByRole("button", { name: "Next", exact: true });
      await nextBtn.click();
      await expect(answerBtn).toBeVisible(); // test answer button exists

      await answerBtn.click();
      await expect(page.getByText(/Mocked Track/)).toBeVisible(); // test answer of second track

      await nextBtn.click();
      await expect(toastText.last()).toHaveText("No more songs available for selected artists/tags."); // test warning

      await startBtn.click();
      await expect(toastText.last()).toHaveText("No more songs available for selected artists/tags."); // test warning
    } else {
      await expect(page.getByText(/select/i)).toBeVisible();
    }
  });

  test("test: navigate to login page when login button is clicked", async ({ page }) => {
    const loginBtn = page.getByRole("link", { name: "Login" });
    await expect(loginBtn).toBeVisible(); // test login button exists
    await loginBtn.click();

    await expect(page).toHaveURL(/\/login$/); // test page navigation
  });
});
