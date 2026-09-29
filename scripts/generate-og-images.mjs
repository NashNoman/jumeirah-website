// Regenerates the static Open Graph / Twitter share-card images
// (public/images/og-image.png, og-image-ar.png) via a real Chromium render,
// so Arabic text gets correct shaping/ligatures (next/og's Satori renderer
// cannot shape Arabic script correctly — this is why these are static
// pre-rendered files rather than a dynamic opengraph-image.tsx route).
//
// Run after changing the brand name, Metadata.og-slogan, the hero photo, or
// the logo: `bun run generate:og`
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const toDataUri = (p, mime) =>
  `data:${mime};base64,${readFileSync(p).toString("base64")}`;

const en = JSON.parse(readFileSync(path.join(root, "messages/en.json")));
const ar = JSON.parse(readFileSync(path.join(root, "messages/ar.json")));

const logo = toDataUri(path.join(root, "public/images/logo.png"), "image/png");
const heroBg = toDataUri(
  path.join(root, "public/images/hero-background-image.webp"),
  "image/webp",
);
const aeonikBold = toDataUri(
  path.join(root, "src/fonts/aeonik/AeonikTRIAL-Bold.otf"),
  "font/otf",
);
const aeonikRegular = toDataUri(
  path.join(root, "src/fonts/aeonik/AeonikTRIAL-Regular.otf"),
  "font/otf",
);
const hacenTunisia = toDataUri(
  path.join(root, "src/fonts/Hacen Tunisia.ttf"),
  "font/ttf",
);

const variants = [
  {
    dir: "ltr",
    brand: `${en.Common.jumeirah} ${en.Common.rei}`,
    slogan: en.Metadata["og-slogan"],
    fontFamily: "Aeonik",
    out: "public/images/og-image.png",
  },
  {
    dir: "rtl",
    brand: `${ar.Common.jumeirah} ${ar.Common.rei}`,
    slogan: ar.Metadata["og-slogan"],
    fontFamily: "Hacen Tunisia",
    out: "public/images/og-image-ar.png",
  },
];

function html({ dir, brand, slogan, fontFamily }) {
  return `<!doctype html>
<html dir="${dir}">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Aeonik'; src: url('${aeonikBold}') format('opentype'); font-weight: 700; }
  @font-face { font-family: 'Aeonik'; src: url('${aeonikRegular}') format('opentype'); font-weight: 400; }
  @font-face { font-family: 'Hacen Tunisia'; src: url('${hacenTunisia}') format('truetype'); font-weight: 400 700; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; background: #000101; overflow: hidden; }
  .card {
    position: relative;
    width: 1200px; height: 630px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: '${fontFamily}', sans-serif;
  }
  .bg {
    position: absolute; inset: 0;
    background-image: url('${heroBg}');
    background-size: cover; background-position: top right;
  }
  .scrim-a {
    position: absolute; inset: 0;
    background: linear-gradient(to top, #000101 15%, rgba(0,1,1,0.55) 55%, rgba(0,1,1,0.15) 100%);
  }
  .scrim-b {
    position: absolute; inset: 0;
    background: linear-gradient(115deg, rgba(0,1,1,0.75) 20%, rgba(47,58,67,0.35) 65%, rgba(0,1,1,0.15) 100%);
  }
  .content {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: center;
    gap: 28px;
  }
  .logo { width: 150px; height: auto; }
  .brand {
    font-weight: 700;
    font-size: 54px;
    color: #ffcb05;
    text-align: center;
    white-space: nowrap;
  }
  .rule { width: 72px; height: 3px; background: #ffcb05; opacity: 0.8; }
  .slogan {
    font-weight: 400;
    font-size: 28px;
    color: #dfdfdf;
    text-align: center;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="bg"></div>
    <div class="scrim-a"></div>
    <div class="scrim-b"></div>
    <div class="content">
      <img class="logo" src="${logo}" />
      <div class="brand">${brand}</div>
      <div class="rule"></div>
      <div class="slogan">${slogan}</div>
    </div>
  </div>
</body>
</html>`;
}

const executablePath =
  process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const v of variants) {
  await page.setContent(html(v), { waitUntil: "networkidle" });
  await page.waitForTimeout(150);
  const buf = await page.screenshot({ type: "png" });
  writeFileSync(path.join(root, v.out), buf);
  console.log("wrote", v.out, buf.length, "bytes");
}

await browser.close();
