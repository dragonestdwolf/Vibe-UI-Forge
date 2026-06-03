/** Storybook 7+ preview iframe (Manager 页内嵌 Story 文档). */
export const STORYBOOK_PREVIEW_IFRAME = "#storybook-preview-iframe";

/**
 * Manager URL: ?path=/story/foo--default → iframe.html?id=foo--default&viewMode=story
 */
export function storybookManagerToIframeUrl(pageUrl) {
  try {
    const url = new URL(pageUrl);
    const storyPath = url.searchParams.get("path");
    if (!storyPath?.startsWith("/story/")) return null;
    const storyId = storyPath.replace(/^\/story\//, "");
    url.pathname = "/iframe.html";
    url.search = "";
    url.searchParams.set("id", storyId);
    url.searchParams.set("viewMode", "story");
    return url.toString();
  } catch {
    return null;
  }
}

export function resolveEffectivePageUrl(pageUrl, render = {}) {
  if (render.useStorybookIframe === false) return pageUrl;
  if (String(pageUrl).includes("iframe.html")) return pageUrl;
  return storybookManagerToIframeUrl(pageUrl) ?? pageUrl;
}

/**
 * Playwright scope: top-level Page or Storybook preview FrameLocator.
 */
export function createRenderScope(page, { frameSelector = null } = {}) {
  if (frameSelector) {
    const frame = page.frameLocator(frameSelector);
    return {
      kind: "frame",
      frameSelector,
      page,
      evaluate: (fn, arg) => frame.evaluate(fn, arg),
      locator: (selector) => frame.locator(selector),
    };
  }
  return {
    kind: "page",
    frameSelector: null,
    page,
    evaluate: (fn, arg) => page.evaluate(fn, arg),
    locator: (selector) => page.locator(selector),
  };
}

/**
 * Resolve where DOM queries run after navigation.
 * 1) iframe.html direct URL → top page
 * 2) Manager + preview iframe with story → frame
 * 3) fallback → top page
 */
export async function resolveRenderScope(page, render = {}) {
  const pageUrl = render.pageUrl ?? "";
  if (pageUrl.includes("iframe.html") || render.useStorybookIframe === false) {
    return createRenderScope(page);
  }

  if (render.useStorybookFrame === true) {
    try {
      await page.waitForSelector(STORYBOOK_PREVIEW_IFRAME, {
        timeout: render.storybookFrameTimeoutMs ?? 15000,
      });
      const frame = createRenderScope(page, { frameSelector: STORYBOOK_PREVIEW_IFRAME });
      await waitForContentRoot(frame, render);
      return frame;
    } catch {
      return createRenderScope(page);
    }
  }

  try {
    const hasIframe = await page.locator(STORYBOOK_PREVIEW_IFRAME).count();
    if (hasIframe > 0) {
      const frame = createRenderScope(page, { frameSelector: STORYBOOK_PREVIEW_IFRAME });
      const ready = await waitForContentRoot(frame, render);
      if (ready) return frame;
    }
  } catch {
    // fall through
  }

  return createRenderScope(page);
}

export async function waitForContentRoot(scope, render = {}) {
  const selector = render.contentRootSelector || "body";
  try {
    await scope.locator(selector).first().waitFor({
      state: "attached",
      timeout: render.contentReadyTimeoutMs ?? 15000,
    });
    if (render.waitMs) await scope.page.waitForTimeout(render.waitMs);
    return true;
  } catch {
    return false;
  }
}

export async function prepareRenderPage(page, render = {}) {
  const effectiveUrl = resolveEffectivePageUrl(render.pageUrl, render);
  const navigationMode = effectiveUrl !== render.pageUrl ? "storybook-iframe-direct" : "direct";

  await page.goto(effectiveUrl, {
    waitUntil: render.waitUntil ?? "domcontentloaded",
    timeout: render.navigationTimeoutMs ?? 15000,
  });

  await page.evaluate(() => document.fonts?.ready).catch(() => {});

  const scope = await resolveRenderScope(page, { ...render, pageUrl: effectiveUrl });
  if (navigationMode === "storybook-iframe-direct") {
    await waitForContentRoot(scope, render);
  } else if (!(await waitForContentRoot(scope, render))) {
    await scope.page.waitForTimeout(render.waitMs ?? 1000);
  }

  return { scope, effectiveUrl, navigationMode };
}
