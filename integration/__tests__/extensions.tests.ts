/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type {
  ConsoleMessage,
  ElectronApplication,
  Frame,
  Page,
} from "playwright";
import { expect } from "@jest/globals";
import * as utils from "../helpers/utils";

describe("extensions page tests", () => {
  let window: Page;
  let cleanup: undefined | (() => Promise<void>);
  let frame: Frame;

  const logger = (msg: ConsoleMessage) => console.log(msg.text());

  beforeAll(
    async () => {
      let app: ElectronApplication;

      ({ window, cleanup, app } = await utils.start());
      window.on("console", logger);
      console.log("await utils.clickWelcomeButton");
      await utils.clickWelcomeButton(window);

      // Navigate to extensions page
      console.log("await app.evaluate");
      await app.evaluate(async ({ app }) => {
        await app.applicationMenu
          ?.getMenuItemById(process.platform === "darwin" ? "mac" : "file")
          ?.submenu?.getMenuItemById("navigate-to-extensions")
          ?.click();
      });

      // Trigger extension install
      const textbox = window.getByPlaceholder("Name or file path or URL");
      console.log("await textbox.fill");
      await textbox.fill(
        process.env.EXTENSION_PATH || "@freelensapp/freelens-node-pod-menu",
      );
      const install_button_selector =
        'button[class*="Button install-module__button--"]';
      console.log("await window.click [data-waiting=false]");
      await window.click(
        install_button_selector.concat("[data-waiting=false]"),
      );

      // Expect extension to be listed in installed list and enabled
      console.log(
        'await window.waitForSelector div[class*="installed-extensions-module__extensionName--"]',
      );
      const installedExtensionName = await (
        await window.waitForSelector(
          'div[class*="installed-extensions-module__extensionName--"]',
        )
      ).textContent();
      expect(installedExtensionName).toBe(
        "@freelensapp/freelens-node-pod-menu",
      );
      const installedExtensionState = await (
        await window.waitForSelector(
          'div[class*="installed-extensions-module__enabled--"]',
        )
      ).textContent();
      expect(installedExtensionState).toBe("Enabled");
      console.log(
        'await window.click i[data-testid*="close-notification-for-notification_"]',
      );
      await window.click(
        'i[data-testid*="close-notification-for-notification_"]',
      );
      console.log(
        'await window.click div[class*=[close-button-module__closeButton--"][aria-label="Close"]',
      );
      await window.click(
        'div[class*="close-button-module__closeButton--"][aria-label="Close"]',
      );

      // Navigate to catalog
      await window.waitForSelector("div[data-rbd-draggable-id=catalog-entity]");
      await window.click("div[data-rbd-draggable-id=catalog-entity]");

      // Navigate to minikube cluster
      frame = await utils.launchMinikubeClusterFromCatalog(window);

      // Expand workloads menu if not already expanded
      await frame.waitForSelector("div[data-testid=sidebar-item-workloads]");
      if (
        (await frame.locator("div[data-testid=sidebar-item-pods]").count()) ===
        0
      ) {
        await frame.click("div[data-testid=sidebar-item-workloads]");
      }
    },
    100 * 60 * 1000,
  );

  afterAll(
    async () => {
      // Cannot log after tests are done.
      window.off("console", logger);
      await cleanup?.();
    },
    10 * 60 * 1000,
  );

  it(
    "installs an extension",
    async () => {
      // Nothing, as only beforeAll is called
    },
    100 * 60 * 1000,
  );

  it.skip(
    "adds menu items to the pod actions dropdown",
    async () => {
      // Navigate to pods view
      await frame.click("div[data-testid=sidebar-item-pods]");

      // Sort pods by running status
      await frame.click(
        'div[id="status"][class="TableCell status nowrap sorting"]',
      );

      // Click on a running pod item's dropdown
      const menu = frame.locator('div[class="TableCell menu"]').last();
      await menu.click();

      // Wait for dropdown menu to appear
      await frame.waitForSelector(
        'ul[id*="menu-actions-for-kube-object-menu-for-"]',
      );

      // Check for expected menu items
      expect(
        await frame
          .locator(
            'li[class="MenuItem"] span[class="title"] >> text="Attach Pod"',
          )
          .count(),
      ).toBe(1);
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Shell"')
          .count(),
      ).toBe(1);
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Logs"')
          .count(),
      ).toBe(1);

      // Close dropdown
      await menu.click();

      // Go back to sorting by name
      await frame.click(
        'div[id="name"][class="TableCell name nowrap sorting"]',
      );
    },
    10 * 60 * 1000,
  );

  it(
    "adds menu items to the node details overlay",
    async () => {
      // Navigate to nodes view
      await frame.click("div[data-testid=sidebar-item-nodes]");

      // Click on minikube node
      await frame.waitForSelector(
        'div[class="TableCell name"] >> text=minikube',
      );
      await frame.click('div[class="TableCell name"] >> text=minikube');

      // Wait for node details to pop out
      await frame.waitForSelector("span[data-icon-name=close]");

      // Check for expected menu items
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Shell"')
          .count(),
      ).toBe(1);
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Cordon"')
          .count(),
      ).toBe(1);
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Drain"')
          .count(),
      ).toBe(1);

      // Close node details
      await frame.click("span[data-icon-name=close]");
    },
    10 * 60 * 1000,
  );

  it(
    "adds menu items to the node actions dropdown",
    async () => {
      // Navigate to nodes view
      await frame.click("div[data-testid=sidebar-item-nodes]");

      // Click on a node item's dropdown
      const menu = frame.locator('div[class="TableCell menu"]').first();
      await menu.click();

      // Wait for dropdown menu to appear
      await frame.waitForSelector(
        'ul[id*="menu-actions-for-kube-object-menu-for-"]',
      );

      // Check for expected menu items
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Shell"')
          .count(),
      ).toBe(1);
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Cordon"')
          .count(),
      ).toBe(1);
      expect(
        await frame
          .locator('li[class="MenuItem"] span[class="title"] >> text="Drain"')
          .count(),
      ).toBe(1);

      // Close dropdown
      await menu.click();
    },
    10 * 60 * 1000,
  );
});
