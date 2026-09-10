import { expect, test } from "@playwright/test";

test("server HTML and Flight carry workspace-specific projects", async ({
  request,
}) => {
  const html = await request.get("/?workspace=garden");
  expect(html.status()).toBe(200);
  expect(await html.text()).toContain("The kitchen garden");
  const flight = await request.get("/?workspace=garden&_rsc=1");
  expect(flight.headers()["content-type"]).toContain("text/x-component");
  expect(await flight.text()).toContain("The kitchen garden");
  expect((await request.get("/missing")).status()).toBe(404);
  expect((await request.post("/")).status()).toBe(405);
});

test("server Context hydrates, focus stays local, and workspace switching updates both sides", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Make room for good work." }),
  ).toBeVisible();
  await page.getByText("Inspect client context").click();
  await page.getByText("Inspect server request").click();
  const requestId = await page.getByTestId("server-request").textContent();
  await expect(page.getByTestId("client-request")).toHaveText(requestId!);
  await page.getByRole("button", { name: "Start a focus session" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Alex, your focus session is on.",
  );
  await expect(page.getByTestId("server-request")).toHaveText(requestId!);
  await page.getByRole("button", { name: "Finish focus session" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Ready when you are, Alex.",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "printscreens/overview.png", fullPage: true });
  await page.getByLabel("Choose workspace").selectOption("garden");
  await page.getByRole("button", { name: "Switch workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Good things grow together." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The kitchen garden" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A quieter internet" }),
  ).toHaveCount(0);
  await page.getByText("Inspect client context").click();
  await page.getByText("Inspect server request").click();
  await expect(page.getByTestId("client-workspace")).toHaveText(
    "Common Ground",
  );
  await expect(page.getByTestId("client-request")).toHaveText(
    (await page.getByTestId("server-request").textContent())!,
  );
  expect(await page.getByTestId("server-request").textContent()).not.toBe(
    requestId,
  );
  await page.getByRole("button", { name: "Start a focus session" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Sam, your focus session is on.",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "printscreens/garden.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("mobile layout fits and server content works without JavaScript", async ({
  browser,
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Current projects" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "printscreens/mobile.png", fullPage: true });
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  await noJsPage.goto("/");
  await expect(
    noJsPage.getByRole("heading", { name: "A quieter internet" }),
  ).toBeVisible();
  await noJsPage.getByLabel("Choose workspace").selectOption("garden");
  await noJsPage.getByRole("button", { name: "Switch workspace" }).click();
  await expect(
    noJsPage.getByRole("heading", { name: "The kitchen garden" }),
  ).toBeVisible();
  await context.close();
});
