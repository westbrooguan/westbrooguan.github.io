# westbrooguan Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a Chinese, Apple-inspired technical portfolio for 管巍 at `westbrooguan.github.io`.

**Architecture:** A dependency-free static site lives in `src/` and is copied to `dist/` by a small Node.js standard-library build script. A standard-library validation script checks confirmed content, privacy exclusions, navigation, accessibility hooks, and output integrity; GitHub Actions builds and deploys `dist/` to GitHub Pages.

**Tech Stack:** Semantic HTML5, CSS, small vanilla JavaScript, Node.js standard library, GitHub Actions, GitHub Pages.

## Global Constraints

- The audience is Chinese-speaking technical peers in security, risk control, search governance, and algorithms.
- Use the selected “技术作品档案” direction: warm paper gray, ink black, warm white, restrained security green, precise grid, case-study-first hierarchy.
- Public contact information is limited to `westbrooguan@qq.com`; never expose the phone number or birth date from the résumé.
- Do not invent current employment, paper titles, patent titles, or expanded regulatory details.
- Keep the site dependency-free; use platform features and Node.js standard library only.
- Support responsive layouts, keyboard navigation, visible focus, sufficient contrast, and `prefers-reduced-motion`.
- Deploy the production output through GitHub Pages at the repository’s user-site domain.

---

## File Structure

- `src/index.html`: semantic document structure, confirmed Chinese copy, metadata, and anchors.
- `src/styles.css`: visual system, grid, responsive rules, interaction states, and reduced-motion behavior.
- `src/main.js`: progressive enhancement for the current year and intersection-based reveal classes.
- `scripts/build.mjs`: dependency-free clean copy from `src/` to `dist/`.
- `scripts/validate-site.mjs`: source and built-output assertions used locally and in CI.
- `package.json`: stable `test`, `build`, and `dev` entry points without dependencies.
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deployment workflow.
- `.gitignore`: ignores generated and temporary artifacts.
- `README.md`: concise local preview, validation, build, and deployment notes.

### Task 1: Add the Validation and Build Contract

**Files:**
- Create: `package.json`
- Create: `scripts/validate-site.mjs`
- Create: `scripts/build.mjs`
- Create: `.gitignore`

**Interfaces:**
- Consumes: `src/index.html`, `src/styles.css`, and `src/main.js` once Task 2 creates them.
- Produces: `npm test` for source validation and `npm run build` for a clean `dist/` directory followed by output validation.

- [ ] **Step 1: Write the failing validation script**

Create `scripts/validate-site.mjs` with standard-library assertions that read either `src/` or the directory passed as the first argument:

```js
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
console.log(`Validated ${root}`);
```

- [ ] **Step 2: Run the validator and verify it fails**

Run: `node scripts/validate-site.mjs`

Expected: FAIL with `ENOENT: no such file or directory, open 'src/index.html'`.

- [ ] **Step 3: Add the dependency-free build entry points**

Create `package.json`:

```json
{
  "name": "westbrooguan.github.io",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "python3 -m http.server 4173 -d src",
    "test": "node scripts/validate-site.mjs",
    "build": "node scripts/build.mjs"
  }
}
```

Create `scripts/build.mjs`:

```js
import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("src", "dist", { recursive: true });
process.argv[2] = "dist";
await import("./validate-site.mjs");
console.log("Built dist");
```

Create `.gitignore`:

```gitignore
dist/
tmp/
.superpowers/
.DS_Store
```

- [ ] **Step 4: Commit the contract**

Run:

```bash
git add package.json scripts/build.mjs scripts/validate-site.mjs .gitignore
git commit -m "chore: add static site build contract"
```

Expected: one commit containing only the build, validation, and ignore files.

### Task 2: Build the Technical Portfolio

**Files:**
- Create: `src/index.html`
- Create: `src/styles.css`
- Create: `src/main.js`

**Interfaces:**
- Consumes: the assertions in `scripts/validate-site.mjs` and the confirmed copy in the design specification.
- Produces: a complete static portfolio accepted by `npm test` and copied unchanged into `dist/` by `npm run build`.

- [ ] **Step 1: Create the semantic HTML document**

Create `src/index.html` with:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="管巍，安全算法工程师。专注搜索反黑反诈、内容风控与智能治理。">
    <meta property="og:title" content="管巍｜安全算法工程师">
    <meta property="og:description" content="让风险，在抵达用户之前消失。">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="zh_CN">
    <title>管巍｜安全算法工程师</title>
    <link rel="stylesheet" href="./styles.css">
    <script type="module" src="./main.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main">跳到主要内容</a>
    <header class="site-header">
      <a class="wordmark" href="#top" aria-label="返回首页">WG.</a>
      <nav aria-label="主要导航">
        <a href="#cases">案例</a><a href="#experience">经历</a><a href="#about">关于</a><a href="#contact">联系</a>
      </nav>
    </header>
    <main id="main">
      <section class="hero" id="top" aria-labelledby="hero-title">
        <p class="eyebrow">安全算法工程师 · Security Algorithm Engineer</p>
        <h1 id="hero-title">让风险，<br>在抵达用户之前消失。</h1>
        <p class="hero-copy">管巍，聚焦搜索反黑反诈、内容风控与智能治理，将算法能力转化为可衡量的安全结果。</p>
        <p class="hero-meta">百度安全平台 · 2021.12–2025.12</p>
      </section>
      <section class="metrics" aria-label="关键成果">
        <article><strong>1 亿元+</strong><span>累计避免用户财产损失</span></article>
        <article><strong>90%+</strong><span>核心策略召回率</span></article>
        <article><strong>99%+</strong><span>核心策略准确率</span></article>
        <article><strong>6 项</strong><span>独立申请专利</span></article>
      </section>
      <section id="cases" class="section reveal" aria-labelledby="cases-title">
        <p class="eyebrow">Selected work · 01—03</p>
        <h2 id="cases-title">把复杂风险，变成可执行的系统。</h2>
        <div class="case-grid">
          <article class="case-card case-card--featured">
            <span>01 · 搜索安全</span><h3>搜索反黑反诈治理</h3>
            <p>搭建“感知 - 召回 - 治理”全流程防御体系，从内容、行为与关系三个维度迭代召回算法，并构建虚假客服态势感知智能体。</p>
            <ul><li>游戏账号交易相关周客诉连续一年清零</li><li>虚假客服周客诉从 120 件降至 20 件</li><li>输出高价值线索并推动涉诈号码治理</li></ul>
          </article>
          <article class="case-card"><span>02 · 内容安全</span><h3>百家号内容风控</h3><p>融合人审数据与 RAG 构建数据飞轮，建设作者实时特征库和标准化检测服务。</p><strong>举报量环比下降 80%</strong></article>
          <article class="case-card"><span>03 · 行业协作</span><h3>监管项目支撑</h3><p>参与反诈技术标准制定，建设易受骗人群库，并输出高价值情报线索。</p><strong>公安部模型竞赛季军支持</strong></article>
        </div>
      </section>
      <section id="experience" class="section reveal" aria-labelledby="experience-title">
        <p class="eyebrow">Experience</p><h2 id="experience-title">经历与研究</h2>
        <div class="timeline"><article><time>2021.12–2025.12</time><div><h3>百度 · 安全平台</h3><p>算法工程师</p></div></article><article><time>2019.09–2022.06</time><div><h3>北京交通大学</h3><p>计算机科学与技术硕士 · GPA 3.72/4</p></div></article><article><time>2015.09–2019.06</time><div><h3>西南大学</h3><p>计算机科学与技术学士 · GPA 3.85/4</p></div></article></div>
      </section>
      <section id="about" class="section about reveal" aria-labelledby="about-title"><div><p class="eyebrow">Capabilities</p><h2 id="about-title">算法之外，理解系统、业务与协作。</h2></div><div><p>熟悉机器学习与深度学习算法，使用 TensorFlow、PyTorch、Hadoop、Spark、Python、Java 与 Linux 构建和落地安全能力。</p><p>IELTS 6.0 · CET-6</p></div></section>
      <section id="contact" class="contact reveal" aria-labelledby="contact-title"><p class="eyebrow">Contact</p><h2 id="contact-title">一起讨论更可靠的智能治理。</h2><a href="mailto:westbrooguan@qq.com">westbrooguan@qq.com</a></section>
    </main>
    <footer>© <span data-current-year>2026</span> 管巍</footer>
  </body>
</html>
```

- [ ] **Step 2: Implement the selected visual system**

Create `src/styles.css` using these exact foundation tokens and native responsive behavior:

```css
:root {
  color-scheme: light;
  --paper: #f1f0eb;
  --ink: #171918;
  --card: #faf9f5;
  --green: #3f6655;
  --muted: #6e716e;
  --line: rgba(23, 25, 24, .16);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Helvetica Neue", sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--ink); }
a { color: inherit; text-decoration-thickness: .08em; text-underline-offset: .18em; }
:focus-visible { outline: 3px solid var(--green); outline-offset: 4px; }
.skip-link { position: fixed; top: 12px; left: 12px; z-index: 20; padding: 10px 14px; background: var(--ink); color: var(--card); transform: translateY(-150%); }
.skip-link:focus { transform: none; }
.site-header, main, footer { width: min(1320px, calc(100% - 48px)); margin-inline: auto; }
.site-header { position: absolute; inset: 0 0 auto; height: 76px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
.wordmark { font-size: 1.2rem; font-weight: 700; text-decoration: none; }
nav { display: flex; gap: clamp(16px, 3vw, 36px); }
nav a { color: var(--muted); font-size: .92rem; text-decoration: none; }
nav a:hover { color: var(--ink); }
.hero { min-height: 72vh; display: grid; align-content: end; grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr); gap: 32px; padding: 128px 0 72px; }
.hero h1 { grid-column: 1; margin: 0; font-size: clamp(3.75rem, 8vw, 8.75rem); line-height: .94; letter-spacing: -.065em; }
.eyebrow { color: var(--green); font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.hero .eyebrow { grid-column: 1 / -1; align-self: end; }
.hero-copy { grid-column: 1; max-width: 670px; margin: 0; color: var(--muted); font-size: clamp(1.1rem, 1.8vw, 1.5rem); line-height: 1.6; }
.hero-meta { grid-column: 2; align-self: end; margin: 0; padding-left: 24px; border-left: 1px solid var(--line); }
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); border-block: 1px solid var(--line); }
.metrics article { padding: 32px 20px; border-right: 1px solid var(--line); }
.metrics article:last-child { border-right: 0; }
.metrics strong { display: block; font-size: clamp(2rem, 4vw, 4.5rem); letter-spacing: -.05em; }
.metrics span { display: block; margin-top: 12px; color: var(--muted); }
.section { padding: 140px 0; border-bottom: 1px solid var(--line); }
.section > h2, .contact h2 { max-width: 900px; margin: 18px 0 56px; font-size: clamp(2.7rem, 5.8vw, 6rem); line-height: 1.04; letter-spacing: -.055em; }
.case-grid { display: grid; grid-template-columns: 1.22fr .89fr .89fr; gap: 20px; }
.case-card { min-height: 420px; padding: 32px; background: var(--card); border: 1px solid var(--line); border-radius: 24px; }
.case-card--featured { background: var(--ink); color: var(--card); }
.case-card span { color: var(--green); font-size: .76rem; font-weight: 700; letter-spacing: .1em; }
.case-card--featured span { color: #9bc7b2; }
.case-card h3 { margin: 88px 0 22px; font-size: clamp(1.7rem, 2.5vw, 2.6rem); line-height: 1.08; }
.case-card p, .case-card li { color: var(--muted); line-height: 1.75; }
.case-card--featured p, .case-card--featured li { color: #c9cbc9; }
.case-card ul { padding-left: 1.2em; }
.case-card strong { display: block; margin-top: 42px; font-size: 1.3rem; }
.timeline article { display: grid; grid-template-columns: minmax(170px, .7fr) 2fr; gap: 32px; padding: 28px 0; border-top: 1px solid var(--line); }
.timeline time { color: var(--green); font-variant-numeric: tabular-nums; }
.timeline h3, .timeline p { margin: 0; }
.timeline h3 { font-size: clamp(1.4rem, 2.4vw, 2.2rem); }
.timeline p { margin-top: 8px; color: var(--muted); }
.about { display: grid; grid-template-columns: 1.2fr .8fr; gap: 64px; }
.about h2 { margin-bottom: 0; }
.about > div:last-child { align-self: end; color: var(--muted); font-size: 1.05rem; line-height: 1.8; }
.contact { padding: 140px 0 120px; }
.contact a { display: inline-block; color: var(--green); font-size: clamp(1.4rem, 3vw, 3rem); }
footer { display: flex; justify-content: space-between; padding: 28px 0 40px; color: var(--muted); font-size: .85rem; }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
.case-card { transition: transform .25s ease, box-shadow .25s ease; }
.case-card:hover { transform: translateY(-4px); box-shadow: 0 20px 45px rgba(23, 25, 24, .08); }
@media (max-width: 820px) {
  .site-header, main, footer { width: min(100% - 32px, 680px); }
  .hero, .case-grid { grid-template-columns: 1fr; }
  .hero-meta { grid-column: 1; padding: 18px 0 0; border-left: 0; border-top: 1px solid var(--line); }
  .metrics { grid-template-columns: repeat(2, 1fr); }
  .metrics article:nth-child(2) { border-right: 0; }
  .about { grid-template-columns: 1fr; gap: 24px; }
}
@media (max-width: 520px) {
  .metrics { grid-template-columns: 1fr; }
  .metrics article { border-right: 0; border-bottom: 1px solid var(--line); }
  .metrics article:last-child { border-bottom: 0; }
  .hero { min-height: auto; padding-top: 112px; }
  nav { gap: 14px; }
  nav a:nth-child(3) { display: none; }
  .section, .contact { padding: 96px 0; }
  .timeline article { grid-template-columns: 1fr; gap: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  .reveal { opacity: 1; transform: none; }
}
@media print {
  .site-header { position: static; }
  .hero { min-height: auto; }
  .reveal { opacity: 1; transform: none; }
  .case-card { break-inside: avoid; }
}
```

- [ ] **Step 3: Add progressive enhancement**

Create `src/main.js`:

```js
document.querySelector("[data-current-year]").textContent = new Date().getFullYear();

const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
} else {
  items.forEach((item) => item.classList.add("is-visible"));
}
```

- [ ] **Step 4: Run source validation and fix only reported contract failures**

Run: `npm test`

Expected: `Validated src`.

- [ ] **Step 5: Run the clean production build**

Run: `npm run build`

Expected:

```text
Validated dist
Built dist
```

- [ ] **Step 6: Commit the complete site**

Run:

```bash
git add src
git commit -m "feat: build technical portfolio"
```

Expected: one commit containing the complete user-facing site.

### Task 3: Add GitHub Pages Publishing

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm test`, `npm run build`, and the generated `dist/` directory from Tasks 1–2.
- Produces: an automated GitHub Pages deployment on every push to `main` and a documented local verification path.

- [ ] **Step 1: Add the Pages workflow**

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Replace the README with operating instructions**

Write `README.md` with the public URL, content summary, and these commands:

````markdown
# westbrooguan.github.io

管巍的中文个人技术网站，聚焦搜索反黑反诈、内容风控与智能治理。

## Local preview

```bash
npm run dev
```

Open <http://localhost:4173>.

## Validate and build

```bash
npm test
npm run build
```

Pushing `main` triggers the GitHub Pages deployment workflow.
````

- [ ] **Step 3: Verify the final tree**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: source validation succeeds, `dist/` validation succeeds, and `git diff --check` prints no errors.

- [ ] **Step 4: Commit publishing configuration**

Run:

```bash
git add .github/workflows/deploy-pages.yml README.md
git commit -m "ci: deploy portfolio to GitHub Pages"
```

Expected: one commit containing only the workflow and README.

- [ ] **Step 5: Publish and verify**

Run: `git push origin main`

Expected: the push succeeds and the `Deploy GitHub Pages` workflow begins. Confirm the workflow succeeds and verify `https://westbrooguan.github.io/` returns the production homepage with the confirmed title and email link.
