import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2] ?? "src";
const [html, css, js] = await Promise.all([
  readFile(join(root, "index.html"), "utf8"),
  readFile(join(root, "styles.css"), "utf8"),
  readFile(join(root, "main.js"), "utf8"),
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
assert.ok(!css.includes("--muted: #6e716e;"), "muted text color does not meet WCAG AA contrast");
console.log(`Validated ${root}`);
