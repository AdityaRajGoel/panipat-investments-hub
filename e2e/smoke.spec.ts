import { test, expect } from "@playwright/test";

// Critical-flow smoke tests. Deterministic: no assertions on live market data.

test("homepage renders hero and primary CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Trusted Partner");
  await expect(page.getByRole("link", { name: /open account/i }).first()).toBeVisible();
});

test("screener page loads with working filter UI", async ({ page }) => {
  await page.goto("/screener");
  await expect(page.locator("h1")).toContainText("Stock Screener");
  const search = page.getByPlaceholder("Search stock...");
  await expect(search).toBeVisible();
  await search.fill("TATA");
  // filters sync into the URL (shareable screens)
  await expect(page).toHaveURL(/q=TATA/);
});

test("learn article renders full content with styling", async ({ page }) => {
  await page.goto("/learn/demat-account");
  await expect(page.locator("h1")).toContainText("Demat Account");
  await expect(page.locator("article")).toContainText("Depository Participant");
  // typography plugin active (regression guard for the missing-prose bug)
  await expect(page.locator("article.prose, article[class*='prose']")).toHaveCount(1);
});

test("open-account page shows the lead form", async ({ page }) => {
  await page.goto("/open-account");
  await expect(page.locator("h1")).toContainText(/demat account/i);
  await expect(page.locator("input").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /submit|open|apply|get started|call/i }).first()).toBeVisible();
});

test("unknown learn slug redirects to the learning center", async ({ page }) => {
  await page.goto("/learn/this-does-not-exist");
  await expect(page).toHaveURL(/\/learn$/);
});

test("pricing page renders the full charges tables", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.locator("h1")).toContainText("Brokerage Charges");
  await expect(page.getByText("0.15%").first()).toBeVisible();
  await expect(page.getByText("₹885 / year")).toBeVisible();
  await expect(page.getByText("Equity Options")).toBeVisible();
});
