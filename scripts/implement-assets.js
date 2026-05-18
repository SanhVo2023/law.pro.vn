#!/usr/bin/env node
/**
 * Auto-generated asset implementation script for law.pro.vn
 * Generated: 2026-04-28T05:36:13.975Z
 *
 * This script copies all generated images into public/images/
 * and outputs a mapping file the site code can import.
 *
 * Usage: node scripts/implement-assets.js
 */

const fs = require("fs");
const path = require("path");

const ASSETS = [
  {
    "id": "hero-home",
    "name": "Homepage Hero — Legal Review Magazine",
    "category": "hero",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-home-4b10c5e9.webp",
    "local_path": "assets/hero/hero-home.webp",
    "alt": "Homepage Hero — Legal Review Magazine - law.pro.vn"
  },
  {
    "id": "hero-analysis-article",
    "name": "Analysis Article Page Hero",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-analysis-article-61be7924.webp",
    "local_path": "assets/hero/hero-analysis-article.webp",
    "alt": "Analysis Article Page Hero - law.pro.vn"
  },
  {
    "id": "hero-case-commentary",
    "name": "Case Commentary Page Hero",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-case-commentary-ffeac787.webp",
    "local_path": "assets/hero/hero-case-commentary.webp",
    "alt": "Case Commentary Page Hero - law.pro.vn"
  },
  {
    "id": "og-default",
    "name": "OG Card — Default",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-default-5e873a1c.webp",
    "local_path": "assets/og/og-default.webp",
    "alt": "OG Card — Default - law.pro.vn"
  },
  {
    "id": "icon-laurel",
    "name": "Icon — Laurel Wreath",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/icon-laurel-8d924da7.webp",
    "local_path": "assets/icon/icon-laurel.webp",
    "alt": "Icon — Laurel Wreath - law.pro.vn"
  },
  {
    "id": "icon-quill",
    "name": "Icon — Quill and Inkwell",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/icon-quill-0a01b5e3.webp",
    "local_path": "assets/icon/icon-quill.webp",
    "alt": "Icon — Quill and Inkwell - law.pro.vn"
  },
  {
    "id": "icon-book-stack",
    "name": "Icon — Stack of Law Books",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/icon-book-stack-8b78808d.webp",
    "local_path": "assets/icon/icon-book-stack.webp",
    "alt": "Icon — Stack of Law Books - law.pro.vn"
  },
  {
    "id": "icon-compass",
    "name": "Icon — Legal Compass / Direction",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/icon-compass-7e8fb687.webp",
    "local_path": "assets/icon/icon-compass.webp",
    "alt": "Icon — Legal Compass / Direction - law.pro.vn"
  },
  {
    "id": "icon-magnifier",
    "name": "Icon — Analytical Magnifier over Document",
    "category": "icon",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/icon-magnifier-9aa32042.webp",
    "local_path": "assets/icon/icon-magnifier.webp",
    "alt": "Icon — Analytical Magnifier over Document - law.pro.vn"
  },
  {
    "id": "icon-favicon",
    "name": "Favicon — Mini Laurel",
    "category": "icon",
    "width": 512,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/icon-favicon-64034943.webp",
    "local_path": "assets/icon/icon-favicon.webp",
    "alt": "Favicon — Mini Laurel - law.pro.vn"
  },
  {
    "id": "bg-parchment-texture",
    "name": "Parchment Section Background",
    "category": "background",
    "width": 1920,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/background/bg-parchment-texture-72180ad9.webp",
    "local_path": "assets/background/bg-parchment-texture.webp",
    "alt": "Parchment Section Background - law.pro.vn"
  },
  {
    "id": "home-hero-feature",
    "name": "Home Cover — Magazine Hero",
    "category": "hero",
    "width": 2400,
    "aspect": "21:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/home-hero-feature-1cc41792.webp",
    "local_path": "assets/hero/home-hero-feature.webp",
    "alt": "Home Cover — Magazine Hero - law.pro.vn"
  },
  {
    "id": "hero-court-practice",
    "name": "Section Hero — Thực tiễn xét xử / Court Practice",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-court-practice-adddada4.webp",
    "local_path": "assets/hero/hero-court-practice.webp",
    "alt": "Section Hero — Thực tiễn xét xử / Court Practice - law.pro.vn"
  },
  {
    "id": "hero-litigation-strategy",
    "name": "Section Hero — Chiến lược hồ sơ / Litigation Strategy",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-litigation-strategy-422e83c5.webp",
    "local_path": "assets/hero/hero-litigation-strategy.webp",
    "alt": "Section Hero — Chiến lược hồ sơ / Litigation Strategy - law.pro.vn"
  },
  {
    "id": "hero-evidence-assessment",
    "name": "Section Hero — Đánh giá chứng cứ / Evidence Assessment",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-evidence-assessment-7c9cdbca.webp",
    "local_path": "assets/hero/hero-evidence-assessment.webp",
    "alt": "Section Hero — Đánh giá chứng cứ / Evidence Assessment - law.pro.vn"
  },
  {
    "id": "hero-litigation-skills",
    "name": "Section Hero — Kỹ năng tranh tụng / Procedural Practice",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-litigation-skills-450efcc2.webp",
    "local_path": "assets/hero/hero-litigation-skills.webp",
    "alt": "Section Hero — Kỹ năng tranh tụng / Procedural Practice - law.pro.vn"
  },
  {
    "id": "hero-professional-perspective",
    "name": "Section Hero — Góc nhìn nghề luật / Professional Perspective",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-professional-perspective-c22d5514.webp",
    "local_path": "assets/hero/hero-professional-perspective.webp",
    "alt": "Section Hero — Góc nhìn nghề luật / Professional Perspective - law.pro.vn"
  },
  {
    "id": "thumb-template-thuc-tien-xet-xu",
    "name": "Article Thumbnail Template — Court Practice",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-thuc-tien-xet-xu-39207f7d.webp",
    "local_path": "assets/thumbnail/thumb-template-thuc-tien-xet-xu.webp",
    "alt": "Article Thumbnail Template — Court Practice - law.pro.vn"
  },
  {
    "id": "thumb-template-chien-luoc-ho-so",
    "name": "Article Thumbnail Template — Litigation Strategy",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-chien-luoc-ho-so-162b7d2e.webp",
    "local_path": "assets/thumbnail/thumb-template-chien-luoc-ho-so.webp",
    "alt": "Article Thumbnail Template — Litigation Strategy - law.pro.vn"
  },
  {
    "id": "thumb-template-danh-gia-chung-cu",
    "name": "Article Thumbnail Template — Evidence Assessment",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-danh-gia-chung-cu-c8207d8f.webp",
    "local_path": "assets/thumbnail/thumb-template-danh-gia-chung-cu.webp",
    "alt": "Article Thumbnail Template — Evidence Assessment - law.pro.vn"
  },
  {
    "id": "thumb-template-ky-nang-tranh-tung",
    "name": "Article Thumbnail Template — Litigation Skills",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-ky-nang-tranh-tung-cd0318d0.webp",
    "local_path": "assets/thumbnail/thumb-template-ky-nang-tranh-tung.webp",
    "alt": "Article Thumbnail Template — Litigation Skills - law.pro.vn"
  },
  {
    "id": "thumb-template-goc-nhin-nghe-luat",
    "name": "Article Thumbnail Template — Professional Perspective",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-goc-nhin-nghe-luat-e3d2b2d9.webp",
    "local_path": "assets/thumbnail/thumb-template-goc-nhin-nghe-luat.webp",
    "alt": "Article Thumbnail Template — Professional Perspective - law.pro.vn"
  },
  {
    "id": "thumb-template-binh-luan-ban-an",
    "name": "Article Thumbnail Template — Case Commentary",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-binh-luan-ban-an-4607214a.webp",
    "local_path": "assets/thumbnail/thumb-template-binh-luan-ban-an.webp",
    "alt": "Article Thumbnail Template — Case Commentary - law.pro.vn"
  },
  {
    "id": "og-thuc-tien-xet-xu",
    "name": "OG Card — Court Practice",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-thuc-tien-xet-xu-75dbaeff.webp",
    "local_path": "assets/og/og-thuc-tien-xet-xu.webp",
    "alt": "OG Card — Court Practice - law.pro.vn"
  },
  {
    "id": "og-chien-luoc-ho-so",
    "name": "OG Card — Litigation Strategy",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-chien-luoc-ho-so-bef99b89.webp",
    "local_path": "assets/og/og-chien-luoc-ho-so.webp",
    "alt": "OG Card — Litigation Strategy - law.pro.vn"
  },
  {
    "id": "og-danh-gia-chung-cu",
    "name": "OG Card — Evidence Assessment",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-danh-gia-chung-cu-6425d334.webp",
    "local_path": "assets/og/og-danh-gia-chung-cu.webp",
    "alt": "OG Card — Evidence Assessment - law.pro.vn"
  },
  {
    "id": "og-ky-nang-tranh-tung",
    "name": "OG Card — Procedural Practice",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-ky-nang-tranh-tung-5e17e950.webp",
    "local_path": "assets/og/og-ky-nang-tranh-tung.webp",
    "alt": "OG Card — Procedural Practice - law.pro.vn"
  },
  {
    "id": "og-goc-nhin-nghe-luat",
    "name": "OG Card — Professional Perspective",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-goc-nhin-nghe-luat-687c4a6c.webp",
    "local_path": "assets/og/og-goc-nhin-nghe-luat.webp",
    "alt": "OG Card — Professional Perspective - law.pro.vn"
  },
  {
    "id": "og-binh-luan-ban-an",
    "name": "OG Card — Case Commentary",
    "category": "og",
    "width": 1200,
    "aspect": "1200:630",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/og/og-binh-luan-ban-an-dae33ed3.webp",
    "local_path": "assets/og/og-binh-luan-ban-an.webp",
    "alt": "OG Card — Case Commentary - law.pro.vn"
  },
  {
    "id": "author-vo-thien-hien",
    "name": "Author Portrait — LS. Võ Thiện Hiển (editorial-style symbolic stand-in)",
    "category": "author",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/author/author-vo-thien-hien-7060a5ed.webp",
    "local_path": "assets/author/author-vo-thien-hien.webp",
    "alt": "Author Portrait — LS. Võ Thiện Hiển (editorial-style symbolic stand-in) - law.pro.vn"
  },
  {
    "id": "author-editorial-team",
    "name": "Author Avatar — Editorial Team (symbolic)",
    "category": "author",
    "width": 1024,
    "aspect": "1:1",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/author/author-editorial-team-5db0dc92.webp",
    "local_path": "assets/author/author-editorial-team.webp",
    "alt": "Author Avatar — Editorial Team (symbolic) - law.pro.vn"
  },
  {
    "id": "ornament-divider",
    "name": "Magazine Section Divider Ornament",
    "category": "icon",
    "width": 1200,
    "aspect": "1200:80",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/icon/ornament-divider-d6152fa5.webp",
    "local_path": "assets/icon/ornament-divider.webp",
    "alt": "Magazine Section Divider Ornament - law.pro.vn"
  }
];

const PUBLIC_DIR = path.resolve(__dirname, "../public/images");

function main() {
  console.log("\n=== Implementing Image Assets for law.pro.vn ===\n");

  // Create public/images directories
  const categories = [...new Set(ASSETS.map(a => a.category))];
  for (const cat of categories) {
    fs.mkdirSync(path.join(PUBLIC_DIR, cat), { recursive: true });
  }

  // Copy local assets to public/images/
  let copied = 0;
  for (const asset of ASSETS) {
    if (asset.local_path) {
      const src = path.resolve(__dirname, "..", asset.local_path);
      const dest = path.join(PUBLIC_DIR, asset.category, asset.id + ".webp");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  Copied: ${asset.id}.webp → public/images/${asset.category}/`);
        copied++;
      } else {
        console.log(`  SKIP (no local file): ${asset.id}`);
      }
    }
  }

  // Generate TypeScript image map for the site code
  const tsMap = `// Auto-generated image asset map for law.pro.vn
// Generated: 2026-04-28T05:36:13.975Z
// Usage: import { IMAGES } from "@/lib/images";
//        <Image src={IMAGES.heroPortrait.cdn} alt={IMAGES.heroPortrait.alt} />

export const IMAGES = {
${ASSETS.map(a => {
    const key = a.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const cdn = a.cdn_url ? `"${a.cdn_url}"` : "null";
    const local = `"/images/${a.category}/${a.id}.webp"`;
    return `  ${key}: {
    id: "${a.id}",
    name: "${a.name}",
    category: "${a.category}",
    cdn: ${cdn},
    local: ${local},
    src: ${cdn} || ${local},
    alt: "${a.alt}",
    width: ${a.width},
    aspect: "${a.aspect}",
  }`;
  }).join(",\n")}
} as const;

export type ImageId = keyof typeof IMAGES;
`;

  const libDir = path.resolve(__dirname, "../src/lib");
  fs.mkdirSync(libDir, { recursive: true });
  fs.writeFileSync(path.join(libDir, "images.ts"), tsMap);
  console.log(`\n  Generated: src/lib/images.ts (${ASSETS.length} images)`);

  // Generate a quick reference markdown
  let readme = "# Image Assets\n\n";
  readme += "| Variable | CDN URL | Local | Alt |\n";
  readme += "|----------|---------|-------|-----|\n";
  for (const a of ASSETS) {
    const key = a.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    readme += `| IMAGES.${key} | ${a.cdn_url || "N/A"} | /images/${a.category}/${a.id}.webp | ${a.alt} |\n`;
  }
  fs.writeFileSync(path.join(PUBLIC_DIR, "README.md"), readme);

  console.log(`\n=== Done! ${copied} files copied, images.ts generated ===`);
  console.log("\nNext steps for the agent:");
  console.log("  1. Import { IMAGES } from '@/lib/images' in your components");
  console.log("  2. Use IMAGES.heroPortrait.src for the src prop");
  console.log("  3. Use IMAGES.heroPortrait.alt for the alt prop");
  console.log("  4. CDN URLs are preferred (IMAGES.xxx.cdn), local fallback (IMAGES.xxx.local)\n");
}

main();
