import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] ?? "src";
const [html, css, js, readme] = await Promise.all([
  readFile(join(root, "index.html"), "utf8"),
  readFile(join(root, "styles.css"), "utf8"),
  readFile(join(root, "main.js"), "utf8"),
  readFile("README.md", "utf8"),
]);

for (const text of ["管巍", "安全算法工程师", "1 亿元+", "90%+", "99%+", "6 项", "westbrooguan@qq.com"]) {
  assert.ok(html.includes(text), `missing confirmed content: ${text}`);
}
for (const privateText of ["15202334314", "1996/08"]) {
  assert.ok(!html.includes(privateText), `private content exposed: ${privateText}`);
}
for (const id of ["cases", "experience", "about", "contact"]) {
  assert.ok(html.includes(`id="${id}"`), `missing section: ${id}`);
  assert.ok(html.includes(`href="#${id}"`), `missing navigation link: ${id}`);
}
assert.ok(html.includes('lang="zh-CN"'), "missing Chinese language declaration");
assert.ok(html.includes('mailto:westbrooguan@qq.com'), "missing email action");
assert.ok(css.includes("prefers-reduced-motion"), "missing reduced-motion support");
assert.ok(css.includes(":focus-visible"), "missing visible keyboard focus");
assert.ok(js.includes("IntersectionObserver"), "missing progressive reveal behavior");
assert.ok(
  html.includes('<html class="no-js" lang="zh-CN">') &&
    css.includes(".js .reveal { opacity: 0;") &&
    !css.includes("\n.reveal { opacity: 0;") &&
    js.includes('document.documentElement.classList.replace("no-js", "js")'),
  "reveal content must be visible by default and hidden only after JavaScript enhancement",
);
assert.ok(!/nav a:nth-child\([^)]*\)\s*{[^}]*display:\s*none/s.test(css), "mobile navigation must not hide any link");
assert.match(css, /nav\s*{[^}]*flex-wrap:\s*wrap/s, "mobile navigation must wrap at narrow widths");

const colors = Object.fromEntries(
  ["paper", "muted", "green"].map((name) => {
    const value = css.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6})\\b`, "i"))?.[1];
    assert.ok(value, `missing hex color token: --${name}`);
    return [name, value];
  }),
);
const luminance = (hex) => {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const [red, green, blue] = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};
for (const name of ["muted", "green"]) {
  const ratio = contrast(colors[name], colors.paper);
  assert.ok(ratio >= 4.5, `--${name} on --paper contrast ${ratio.toFixed(2)} is below 4.5`);
}
assert.ok(readme.includes("https://westbrooguan.github.io/"), "README must include the public URL");
console.log(`Validated ${root}`);
