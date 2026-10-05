import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const svg = readFileSync("public/icon.svg", "utf8");
// Renders the PWA / home-screen icons from public/icon.svg. Usage: node scripts/gen-icons.mjs
// Maskable: full-bleed square, logo within the 80% safe zone
const maskable = svg.replace('rx="112"', 'rx="0"').replace("translate(106 98) scale(3)", "translate(146 140) scale(2.2)");
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
for (const [name, size, src, bg] of [["icon-192.png",192,svg,"transparent"],["icon-512.png",512,svg,"transparent"],["apple-touch-icon.png",180,maskable,"#1B2D5B"],["icon-maskable-512.png",512,maskable,"#1B2D5B"]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:${bg}">${src.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: `public/${name}`, omitBackground: bg === "transparent" });
}
await browser.close();
