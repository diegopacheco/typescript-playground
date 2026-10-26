import { expect, test, type Page } from "@playwright/test";

const shot = (page: Page, name: string) => page.screenshot({ path: `printscreens/${name}.png` });

test("1 search params: the URL drives filtering and drops defaults", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("link", { name: "fantasy" }).click();
  await page.getByRole("link", { name: /sort by rating/ }).click();
  await page.getByRole("link", { name: /sort by rating/ }).click();
  await expect(page).toHaveURL(/genre=fantasy/);
  await expect(page).toHaveURL(/dir=desc/);
  await expect(page.locator(".list li").first()).toContainText("The Hobbit");
  await page.getByRole("link", { name: "all" }).click();
  await expect(page).not.toHaveURL(/genre=/);
  await page.getByLabel("Search books").fill("asimov");
  await expect(page.locator(".list li")).toHaveCount(1);
  await shot(page, "01-search-params");
});

test("2 loaders: nested detail loads by typed id and unknown ids hit notFound", async ({ page }) => {
  await page.goto("/loaders");
  await page.getByRole("link", { name: "Mistborn" }).click();
  await expect(page.locator(".card h3")).toHaveText("Mistborn");
  await expect(page).toHaveURL(/\/loaders\/5$/);
  await page.getByRole("link", { name: "Missing book 999" }).click();
  await expect(page.getByText("No book with that id.")).toBeVisible();
  await page.getByRole("link", { name: "Dune" }).click();
  await expect(page.locator(".card h3")).toHaveText("Dune");
  await shot(page, "02-loaders");
});

test("3 query: optimistic toggle persists, and a server failure rolls back", async ({ page }) => {
  await page.goto("/query");
  const star = page.getByRole("button", { name: "Toggle favorite Neuromancer" });
  await expect(star).toHaveText("☆");
  await star.click();
  await expect(star).toHaveText("★");
  await expect(page.getByRole("status")).toContainText("Saved: Neuromancer favorite = true");
  await page.getByLabel("Make the next server write fail").check();
  await star.click();
  await expect(page.getByRole("status")).toContainText("Rolled back");
  await expect(star).toHaveText("★");
  await shot(page, "03-query");
});

test("4 table: sorts, filters and paginates the lazily loaded grid", async ({ page }) => {
  await page.goto("/table");
  await expect(page.getByText("Page 1 of 3")).toBeVisible();
  await page.getByRole("columnheader", { name: /Year/ }).click();
  await expect(page.getByRole("columnheader", { name: "Year (down)" })).toBeVisible();
  await expect(page.locator(".grid tbody tr").first()).toContainText("Designing Data-Intensive Applications");
  await page.getByRole("columnheader", { name: /Year/ }).click();
  await expect(page.locator(".grid tbody tr").first()).toContainText("The Hobbit");
  await page.getByLabel("Filter table").fill("martin");
  await expect(page.locator(".grid tbody tr")).toHaveCount(2);
  await expect(page.getByText("Page 1 of 1")).toBeVisible();
  await page.getByLabel("Filter table").fill("");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Page 2 of 3")).toBeVisible();
  await shot(page, "04-table");
});

test("5 form: rejects a taken ISBN from the server, then saves a valid book", async ({ page }) => {
  await page.goto("/form");
  await page.getByLabel("Title").fill("Hy");
  await expect(page.getByText("Title needs at least 3 characters")).toBeVisible();
  await page.getByLabel("Title").fill("Hyperion");
  await page.getByLabel("Author").fill("Dan Simmons");
  await page.getByLabel("ISBN").fill("9780441013593");
  await expect(page.getByText("ISBN already in the catalog")).toBeVisible();
  await page.getByLabel("ISBN").fill("9780553283686");
  await page.getByLabel("Tag 1").fill("pilgrims");
  await page.getByRole("button", { name: "Add tag" }).click();
  await page.getByLabel("Tag 2").fill("Pilgrims");
  await expect(page.getByText("Tags must be unique")).toBeVisible();
  await shot(page, "05-form");
  await page.getByLabel("Tag 2").fill("shrike");
  await page.getByRole("button", { name: "Save book" }).click();
  await expect(page.getByRole("status")).toContainText('Saved "Hyperion" with id 13');
});

test("6 preload: hovering an intent link runs the loader before the click", async ({ page }) => {
  await page.goto("/preload");
  const intent = page.locator(".split > div").first().getByRole("link", { name: "Dune" });
  await intent.hover();
  await page.waitForTimeout(1800);
  await intent.click();
  await expect(page.getByText("ran on hover (preloaded)")).toBeVisible({ timeout: 500 });
  await page.locator(".split > div").nth(1).getByRole("link", { name: "Neuromancer" }).click();
  await expect(page.getByText("Slow loader running")).toBeVisible();
  await expect(page.getByText("ran on click")).toBeVisible();
  await shot(page, "06-preload");
});

test("7 blocker: unsaved draft stops navigation until the user confirms", async ({ page }) => {
  await page.goto("/blocker");
  await page.getByLabel("Draft review").fill("A great book about sand");
  await page.getByRole("link", { name: "1. Search Params" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("/search");
  await shot(page, "07-blocker");
  await page.getByRole("button", { name: "Stay" }).click();
  await expect(page).toHaveURL(/\/blocker$/);
  await page.getByRole("link", { name: "1. Search Params" }).click();
  await page.getByRole("button", { name: "Leave" }).click();
  await expect(page).toHaveURL(/\/search$/);
});

test("8 errors: thrown errors and notFound stay inside the route", async ({ page }) => {
  await page.goto("/errors");
  await expect(page.getByText("The loader succeeded")).toBeVisible();
  await page.getByRole("link", { name: "mode=missing" }).click();
  await expect(page.getByText("notFound() was thrown")).toBeVisible();
  await page.getByRole("link", { name: "mode=boom" }).click();
  await expect(page.getByText("Caught: The loader exploded on purpose")).toBeVisible();
  await expect(page.getByRole("link", { name: "1. Search Params" })).toBeVisible();
  await shot(page, "08-errors");
});

test("9 deferred: stats render first and reviews stream in later", async ({ page }) => {
  await page.goto("/deferred");
  await expect(page.getByText("avg rating")).toBeVisible();
  await expect(page.getByText("Reviews are on the way")).toBeVisible();
  await expect(page.getByText("Dune by Frank Herbert is a must read.")).toBeVisible({ timeout: 5000 });
  await shot(page, "09-deferred");
});

test("10 guards: the vault redirects to login and back", async ({ page }) => {
  await page.goto("/vault");
  await expect(page).toHaveURL(/\/login\?redirect=%2Fvault/);
  await page.getByLabel("Your name").fill("Ada");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/vault$/);
  await expect(page.getByText("Welcome to the vault, Ada.")).toBeVisible();
  await shot(page, "10-guards");
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login/);
});
