# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — OEM/ODM brand clients (B2B).** Decision-makers at brands, distributors, and entrepreneurs who want a snack line manufactured under *their own* label ("100% แบรนด์คุณ"). They arrive to judge whether VFoods can credibly produce, certify, package, and ship their product — the site's job is to close this audience.

Secondary audiences the site also serves:
- **Export buyers / distributors** browsing the brand and product catalog (30+ export countries).
- **Domestic retail / trade buyers** evaluating existing VFoods brands and SKUs.

## Product Purpose

VFoods (บริษัท วีฟู้ดส์ จำกัด) is a Thai snack manufacturer. The website is the company's shopfront and OEM sales funnel: it projects market-leader credibility, presents the breadth of what VFoods makes, proves manufacturing credibility (standards, scale, experience), routes serious inquiries into an OEM engagement flow, and links out to retail / e-commerce channels for consumers. Success = an OEM/brand client submits a qualified inquiry (the OEM builder / contact form), buyers can find and trust the product range, and the brand reads as the category leader.

## Positioning

**"วาไรตี้ขนมปังปี๊บ อันดับ 1 ในไทย" — the No.1 tin-packaged biscuit/snack maker in Thailand — is the lead claim.** Per the client redesign brief, the site's #1 objective is projecting credible market leadership in **ขนมปังปี๊บ** (biscuits/snacks in the iconic tin/ปี๊บ). Breadth is the proof: 20+ in-house brands and 100+ products across ~10 categories (ขาไก่/stick snacks, biscuits & crackers, cream-filled biscuits, wafer sticks & sheets, cookies, fried snacks…). That variety is also the OEM proof — a client sees VFoods can make almost any snack, then commissions it under their own label. Competitors on a single hero product cannot copy either the "อันดับ 1 ขนมปังปี๊บ" leadership or the variety claim.

Supporting: **"Variety World of Snacks"** (English framing) · one-stop OEM (concept → recipe → flavor → packaging → production → export) · published food-safety standards.

## Operating Context

- Office **and** factory co-located: 44/4 หมู่ 10 ถนนพระราม 2 ตำบลบางโทรัด อำเภอเมือง จังหวัดสมุทรสาคร 74000.
- Contact: Tel 034-845-448-9, 089-130-8838-9 · info@vfoods.co.th · www.vfoods.co.th.
- Active trade presence — exhibits at THAIFEX (2026).
- Site is bilingual-leaning: **Thai is the primary voice**, with English used for navigation, taglines, and export-facing framing.
- The OEM journey is a real product surface: an OEM Engagement Guide + an OEM builder that hands off to the contact form (`oem-guide.html`, `contact.html`).
- **Client design brief** = the "Redesign-Web" slide deck (25 slides). It defines scope & intent: ~29 pages (~13 brand + ~10 product + 6 home), merge About into the home, a home-hero mascot band, an OEM mascot step-journey **with real client logos + factory video**, brand pages with flavor icons + per-brand backgrounds, contact upgrades, and E-commerce/retail links to surface.
- **Reference sites the client likes** (playful CPG motion, not WebGL): taokaenoi, rinbee, useful foods — "ซองขนมขยับตอนคลิก", video, varied fonts, and a "VFoods" letter-convergence intro. **No 3D engine / WebGL is required by the brief.**

## Capabilities and Constraints

- **Deliverable is a static site** (plain HTML/CSS/JS, no build step / framework — the existing codebase is the authority on stack). Runs from any static host / local `python -m http.server`.
- Structure: COOKIEVERSE home (`scroll-site/`) + white-themed inner pages — brands catalog, products, news, OEM guide, contact.
- Product catalog holds **~118 real SKUs with real dimensions** (from the dimension Excel), driven by `brand-products.js`; packshots pulled from the shared VFoods Google Drive.
- **Terminology:** OEM / ODM (รับจ้างผลิต), "แบรนด์ในเครือ" (in-group brands), "สินค้าแบรนด์คุณเอง" (your-own-brand).
- Assets live partly outside the repo (Drive dump, source video/images, `.ai`, `.xlsx`) — see `.gitignore`.

## Brand Commitments

- **Name:** VFoods / วีฟู้ดส์ · legal: VFoods Co., Ltd. (บริษัท วีฟู้ดส์ จำกัด).
- **Taglines in use:** "วาไรตี้ขนมปังปี๊บ อันดับ 1" · "อร่อยทุกคำ ทุกโอกาส" · "The Variety World of Snacks".
- **Logo:** `img/logo-vfoods.png` (VFOODS wordmark, red badge).
- **Mascots (two treatments, per brief):**
  - *Home hero:* a **band of snack-character mascots walking across a crosswalk** (Abbey-Road style) — the first thing on entering the site (brief slide 8).
  - *OEM guide:* a single **คุกกี้น้อย** — an orange-cap cookie carrying a "V" — that **walks the visitor through each OEM step** (brief slide 23). Related build note: [[vfoods-mascot-scrub]].
- Custom brand font present: **FC Vision Rounded** (bundled, non-commercial license — check before commercial use).
- Existing site identity: warm orange/chocolate/cream world + a constant orange nav; documented in DESIGN.md (that file owns visual direction, not this one).

## Evidence on Hand

Confirmed, publishable facts (stated on the current site and/or the brief deck):
- **20+ years** experience · **30+ export countries** · **20+ in-group brands** · **100+ products**.
- **Certifications (confirmed real — shown on the current home and the brief deck):** **FSSC 22000 · HACCP · GMP · HALAL · Thailand Trust Mark**.
  - ⚠️ *Do not fabricate certificate numbers or issuing bodies — none were provided. Use the certification names only until actual certificates are supplied.*
- **Real OEM client logos on hand** at [`ลูกค้าของเรา/`](ลูกค้าของเรา) (~18 JPGs) — the "ลูกค้าของเรา" to feature on the OEM guide (brief slide 23): Lotus, Makro, Nissin, Mahanakhon (หทัยทิพย์), Tops, Cold Storage, BigC, Carrefour, Peachy, Giant, Vedan, Hemali, Max-mart, Omais, Nilrich, S&P, SureBuy.
- Real product data: ~118 SKUs with dimensions (`brand-products.js`, dimension Excel); real packshots + per-category/brand/packaging photography sourced from the VFoods Google Drive (Drive folder links enumerated in the brief deck).
- **Absent / must not be invented:** customer testimonials/quotes, revenue/volume figures, award claims, and any certificate detail beyond the five names above. (Client logos ARE available — use the real ones in `ลูกค้าของเรา/`; do not invent others.)

## Product Principles

1. **Breadth is the pitch.** Every surface should reinforce that VFoods makes an enormous variety of snacks — that range is what earns OEM trust.
2. **Lead with credibility, convert to inquiry.** Show proof (scale, standards, real SKUs) then funnel the OEM/brand client into a qualified inquiry.
3. **Real over rendered.** Prefer real product photography and real SKU/dimension data over placeholders; the catalog's authenticity is a selling point.
4. **Thai-first, export-ready.** Primary voice is Thai; keep English framing clean for export buyers.
5. **Never fabricate proof.** Use only the confirmed certs (FSSC 22000 · HACCP · GMP · HALAL · Thailand Trust Mark) and the real client logos in `ลูกค้าของเรา/`; never invent testimonials, revenue, awards, or clients beyond those. Gaps stay gaps.

## Accessibility & Inclusion

No formal standard was established by the client. Baseline expectation: legible Thai + Latin type, sufficient contrast on the white inner pages, and touch-appropriate mobile motion (the current build already targets mobile-specific motion, not a shrunk desktop).
