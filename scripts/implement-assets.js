#!/usr/bin/env node
/**
 * Auto-generated asset implementation script for law.pro.vn
 * Generated: 2026-05-28T19:40:04.028Z
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
  },
  {
    "id": "home-hero-feature-realistic",
    "name": "Home Cover — Documentary Photograph",
    "category": "hero",
    "width": 2400,
    "aspect": "21:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/home-hero-feature-realistic-77847326.webp",
    "local_path": "assets/hero/home-hero-feature-realistic.webp",
    "alt": "Home Cover — Documentary Photograph - law.pro.vn"
  },
  {
    "id": "hero-court-practice-realistic",
    "name": "Court Practice Hub — Documentary",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-court-practice-realistic-e7847a41.webp",
    "local_path": "assets/hero/hero-court-practice-realistic.webp",
    "alt": "Court Practice Hub — Documentary - law.pro.vn"
  },
  {
    "id": "hero-litigation-strategy-realistic",
    "name": "Litigation Strategy Hub — Documentary",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-litigation-strategy-realistic-bc0fa8e6.webp",
    "local_path": "assets/hero/hero-litigation-strategy-realistic.webp",
    "alt": "Litigation Strategy Hub — Documentary - law.pro.vn"
  },
  {
    "id": "hero-evidence-assessment-realistic",
    "name": "Evidence Assessment Hub — Documentary",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-evidence-assessment-realistic-7d113832.webp",
    "local_path": "assets/hero/hero-evidence-assessment-realistic.webp",
    "alt": "Evidence Assessment Hub — Documentary - law.pro.vn"
  },
  {
    "id": "hero-litigation-skills-realistic",
    "name": "Procedural Practice Hub — Documentary",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-litigation-skills-realistic-60d3fa24.webp",
    "local_path": "assets/hero/hero-litigation-skills-realistic.webp",
    "alt": "Procedural Practice Hub — Documentary - law.pro.vn"
  },
  {
    "id": "hero-professional-perspective-realistic",
    "name": "Professional Perspective Hub — Documentary",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-professional-perspective-realistic-8d48a4dd.webp",
    "local_path": "assets/hero/hero-professional-perspective-realistic.webp",
    "alt": "Professional Perspective Hub — Documentary - law.pro.vn"
  },
  {
    "id": "hero-case-commentary-realistic",
    "name": "Case Commentary Hub — Documentary",
    "category": "hero",
    "width": 1600,
    "aspect": "16:9",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/hero/hero-case-commentary-realistic-13998ebf.webp",
    "local_path": "assets/hero/hero-case-commentary-realistic.webp",
    "alt": "Case Commentary Hub — Documentary - law.pro.vn"
  },
  {
    "id": "thumb-template-thuc-tien-xet-xu-realistic",
    "name": "Court Practice — Thumb (Documentary)",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-thuc-tien-xet-xu-realistic-9cbb1954.webp",
    "local_path": "assets/thumbnail/thumb-template-thuc-tien-xet-xu-realistic.webp",
    "alt": "Court Practice — Thumb (Documentary) - law.pro.vn"
  },
  {
    "id": "thumb-template-chien-luoc-ho-so-realistic",
    "name": "Litigation Strategy — Thumb (Documentary)",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-chien-luoc-ho-so-realistic-44d82001.webp",
    "local_path": "assets/thumbnail/thumb-template-chien-luoc-ho-so-realistic.webp",
    "alt": "Litigation Strategy — Thumb (Documentary) - law.pro.vn"
  },
  {
    "id": "thumb-template-danh-gia-chung-cu-realistic",
    "name": "Evidence Assessment — Thumb (Documentary)",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-danh-gia-chung-cu-realistic-b1356184.webp",
    "local_path": "assets/thumbnail/thumb-template-danh-gia-chung-cu-realistic.webp",
    "alt": "Evidence Assessment — Thumb (Documentary) - law.pro.vn"
  },
  {
    "id": "thumb-template-ky-nang-tranh-tung-realistic",
    "name": "Procedural Practice — Thumb (Documentary)",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-ky-nang-tranh-tung-realistic-c5deed32.webp",
    "local_path": "assets/thumbnail/thumb-template-ky-nang-tranh-tung-realistic.webp",
    "alt": "Procedural Practice — Thumb (Documentary) - law.pro.vn"
  },
  {
    "id": "thumb-template-goc-nhin-nghe-luat-realistic",
    "name": "Professional Perspective — Thumb (Documentary)",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-goc-nhin-nghe-luat-realistic-c5578d16.webp",
    "local_path": "assets/thumbnail/thumb-template-goc-nhin-nghe-luat-realistic.webp",
    "alt": "Professional Perspective — Thumb (Documentary) - law.pro.vn"
  },
  {
    "id": "thumb-template-binh-luan-ban-an-realistic",
    "name": "Case Commentary — Thumb (Documentary)",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/thumb-template-binh-luan-ban-an-realistic-b5ac1a17.webp",
    "local_path": "assets/thumbnail/thumb-template-binh-luan-ban-an-realistic.webp",
    "alt": "Case Commentary — Thumb (Documentary) - law.pro.vn"
  },
  {
    "id": "post-1",
    "name": "Thực tiễn xét xử tranh chấp hợp đồng tại Việt Nam",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-1-c1173ccb.webp",
    "local_path": "assets/thumbnail/post-1.webp",
    "alt": "Thực tiễn xét xử tranh chấp hợp đồng tại Việt Nam - law.pro.vn"
  },
  {
    "id": "post-2",
    "name": "Xu hướng xét xử các vụ ly hôn có yếu tố tài sản lớn",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-2-b88bf0c9.webp",
    "local_path": "assets/thumbnail/post-2.webp",
    "alt": "Xu hướng xét xử các vụ ly hôn có yếu tố tài sản lớn - law.pro.vn"
  },
  {
    "id": "post-3",
    "name": "Chiến lược chuẩn bị hồ sơ khởi kiện dân sự",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-3-ff3a5f9c.webp",
    "local_path": "assets/thumbnail/post-3.webp",
    "alt": "Chiến lược chuẩn bị hồ sơ khởi kiện dân sự - law.pro.vn"
  },
  {
    "id": "post-4",
    "name": "Kỹ thuật soạn đơn khởi kiện đúng quy định",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-4-f7ad1f93.webp",
    "local_path": "assets/thumbnail/post-4.webp",
    "alt": "Kỹ thuật soạn đơn khởi kiện đúng quy định - law.pro.vn"
  },
  {
    "id": "post-5",
    "name": "Đánh giá chứng cứ trong tranh chấp đất đai",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-5-8ec459f6.webp",
    "local_path": "assets/thumbnail/post-5.webp",
    "alt": "Đánh giá chứng cứ trong tranh chấp đất đai - law.pro.vn"
  },
  {
    "id": "post-6",
    "name": "Vai trò của chứng cứ điện tử trong tố tụng",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-6-fd77664e.webp",
    "local_path": "assets/thumbnail/post-6.webp",
    "alt": "Vai trò của chứng cứ điện tử trong tố tụng - law.pro.vn"
  },
  {
    "id": "post-7",
    "name": "Kỹ năng tranh luận tại phiên tòa dân sự",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-7-9815de21.webp",
    "local_path": "assets/thumbnail/post-7.webp",
    "alt": "Kỹ năng tranh luận tại phiên tòa dân sự - law.pro.vn"
  },
  {
    "id": "post-8",
    "name": "Chiến thuật phản bác lập luận đối phương",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-8-918ee5d4.webp",
    "local_path": "assets/thumbnail/post-8.webp",
    "alt": "Chiến thuật phản bác lập luận đối phương - law.pro.vn"
  },
  {
    "id": "post-9",
    "name": "Đạo đức nghề luật sư tại Việt Nam",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-9-e39717ea.webp",
    "local_path": "assets/thumbnail/post-9.webp",
    "alt": "Đạo đức nghề luật sư tại Việt Nam - law.pro.vn"
  },
  {
    "id": "post-10",
    "name": "Thách thức và cơ hội cho luật sư trong thời đại AI",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-10-14328ca4.webp",
    "local_path": "assets/thumbnail/post-10.webp",
    "alt": "Thách thức và cơ hội cho luật sư trong thời đại AI - law.pro.vn"
  },
  {
    "id": "post-11",
    "name": "Thực tiễn xét xử tranh chấp đất đai tại TP.HCM",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-11-b13f2006.webp",
    "local_path": "assets/thumbnail/post-11.webp",
    "alt": "Thực tiễn xét xử tranh chấp đất đai tại TP.HCM - law.pro.vn"
  },
  {
    "id": "post-12",
    "name": "Xu hướng xét xử tranh chấp lao động 2025-2026",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-12-e6445373.webp",
    "local_path": "assets/thumbnail/post-12.webp",
    "alt": "Xu hướng xét xử tranh chấp lao động 2025-2026 - law.pro.vn"
  },
  {
    "id": "post-13",
    "name": "Thực tiễn áp dụng án lệ tại Việt Nam",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-13-a7dcb0c6.webp",
    "local_path": "assets/thumbnail/post-13.webp",
    "alt": "Thực tiễn áp dụng án lệ tại Việt Nam - law.pro.vn"
  },
  {
    "id": "post-14",
    "name": "Phân tích bản án tranh chấp thừa kế điển hình",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-14-aa279e20.webp",
    "local_path": "assets/thumbnail/post-14.webp",
    "alt": "Phân tích bản án tranh chấp thừa kế điển hình - law.pro.vn"
  },
  {
    "id": "post-15",
    "name": "Chiến lược chuẩn bị hồ sơ tranh chấp đất đai",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-15-a363fa78.webp",
    "local_path": "assets/thumbnail/post-15.webp",
    "alt": "Chiến lược chuẩn bị hồ sơ tranh chấp đất đai - law.pro.vn"
  },
  {
    "id": "post-16",
    "name": "Kỹ thuật soạn hợp đồng phòng ngừa tranh chấp",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-16-c9e3fd66.webp",
    "local_path": "assets/thumbnail/post-16.webp",
    "alt": "Kỹ thuật soạn hợp đồng phòng ngừa tranh chấp - law.pro.vn"
  },
  {
    "id": "post-17",
    "name": "Chiến lược đàm phán hòa giải hiệu quả",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-17-da959229.webp",
    "local_path": "assets/thumbnail/post-17.webp",
    "alt": "Chiến lược đàm phán hòa giải hiệu quả - law.pro.vn"
  },
  {
    "id": "post-18",
    "name": "Giám định tư pháp trong vụ án dân sự",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-18-a72eb541.webp",
    "local_path": "assets/thumbnail/post-18.webp",
    "alt": "Giám định tư pháp trong vụ án dân sự - law.pro.vn"
  },
  {
    "id": "post-19",
    "name": "Thu thập và bảo quản chứng cứ điện tử",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-19-bb0550f5.webp",
    "local_path": "assets/thumbnail/post-19.webp",
    "alt": "Thu thập và bảo quản chứng cứ điện tử - law.pro.vn"
  },
  {
    "id": "post-20",
    "name": "Đánh giá chứng cứ trong tranh chấp hợp đồng",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-20-d7faf34f.webp",
    "local_path": "assets/thumbnail/post-20.webp",
    "alt": "Đánh giá chứng cứ trong tranh chấp hợp đồng - law.pro.vn"
  },
  {
    "id": "post-21",
    "name": "Kỹ năng xét hỏi nhân chứng tại tòa",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-21-23f54fd7.webp",
    "local_path": "assets/thumbnail/post-21.webp",
    "alt": "Kỹ năng xét hỏi nhân chứng tại tòa - law.pro.vn"
  },
  {
    "id": "post-22",
    "name": "Chiến thuật tranh luận tại phiên tòa phúc thẩm",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-22-74f1eab1.webp",
    "local_path": "assets/thumbnail/post-22.webp",
    "alt": "Chiến thuật tranh luận tại phiên tòa phúc thẩm - law.pro.vn"
  },
  {
    "id": "post-23",
    "name": "Kỹ năng viết bản luận cứ bảo vệ",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-23-93fe9673.webp",
    "local_path": "assets/thumbnail/post-23.webp",
    "alt": "Kỹ năng viết bản luận cứ bảo vệ - law.pro.vn"
  },
  {
    "id": "post-24",
    "name": "Nghệ thuật thuyết phục hội đồng xét xử",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-24-7a429ad5.webp",
    "local_path": "assets/thumbnail/post-24.webp",
    "alt": "Nghệ thuật thuyết phục hội đồng xét xử - law.pro.vn"
  },
  {
    "id": "post-25",
    "name": "Luật sư và trí tuệ nhân tạo: cơ hội hay thách thức",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-25-54896219.webp",
    "local_path": "assets/thumbnail/post-25.webp",
    "alt": "Luật sư và trí tuệ nhân tạo: cơ hội hay thách thức - law.pro.vn"
  },
  {
    "id": "post-26",
    "name": "Bình luận Án lệ 09/2016 — hợp đồng mua bán nhà ở chưa công chứng",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-26-68196d5e.webp",
    "local_path": "assets/thumbnail/post-26.webp",
    "alt": "Bình luận Án lệ 09/2016 — hợp đồng mua bán nhà ở chưa công chứng - law.pro.vn"
  },
  {
    "id": "post-27",
    "name": "Bình luận Án lệ 42/2021 — bồi thường vi phạm hợp đồng",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-27-801b7a44.webp",
    "local_path": "assets/thumbnail/post-27.webp",
    "alt": "Bình luận Án lệ 42/2021 — bồi thường vi phạm hợp đồng - law.pro.vn"
  },
  {
    "id": "post-28",
    "name": "Bình luận vụ ly hôn có yếu tố nước ngoài — quyền nuôi con",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-28-49fd8e29.webp",
    "local_path": "assets/thumbnail/post-28.webp",
    "alt": "Bình luận vụ ly hôn có yếu tố nước ngoài — quyền nuôi con - law.pro.vn"
  },
  {
    "id": "post-29",
    "name": "Bình luận tranh chấp cổ đông thiểu số — Điều 153 LDN 2020",
    "category": "thumbnail",
    "width": 1024,
    "aspect": "4:3",
    "cdn_url": "https://pub-ebe397ad6fc946888f5c9aacc3cc48bb.r2.dev/law.pro.vn/thumbnail/post-29-321e8a19.webp",
    "local_path": "assets/thumbnail/post-29.webp",
    "alt": "Bình luận tranh chấp cổ đông thiểu số — Điều 153 LDN 2020 - law.pro.vn"
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
// Generated: 2026-05-28T19:40:04.028Z
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
