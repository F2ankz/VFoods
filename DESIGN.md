---
name: VFoods COOKIEVERSE
description: A warm, appetizing identity for Thailand's No.1 tin-biscuit maker — playful mascots, orange/chocolate/cream, one constant orange bar.
colors:
  clip-orange: "#D6590C"
  clip-orange-deep: "#BF4A08"
  orange-primary: "#FF6D1A"
  orange-bright: "#F07800"
  orange-2: "#FF7F2A"
  orange-soft: "#FF9E5C"
  gold: "#FFD35C"
  gold-deep: "#E8A81E"
  panel-red: "#8C1F06"
  nav-maroon: "#8E1B18"
  nav-maroon-scroll: "#6E2A05"
  red-badge: "#E51A1D"
  burgundy-deep: "#651313"
  cream: "#FFF6ED"
  cream-panel: "#FFF8EF"
  chocolate: "#2B1B16"
  chocolate-ink: "#240604"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "FC Vision Rounded, Sarabun, sans-serif"
    fontSize: "clamp(2rem, 6vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Sarabun, sans-serif"
    fontSize: "clamp(1.8rem, 4.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Sarabun, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 300
    lineHeight: 1.85
  label:
    fontFamily: "Sarabun, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  sm: "8px"
  md: "11px"
  lg: "16px"
  xl: "24px"
  xxl: "36px"
  pill: "50px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "88px"
components:
  button-primary:
    backgroundColor: "{colors.clip-orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "#B8480A"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.clip-orange}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
  button-dark:
    backgroundColor: "{colors.chocolate}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "13px 32px"
  glass-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
  product-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.chocolate}"
    rounded: "{rounded.lg}"
  input-field:
    backgroundColor: "#FAFAFA"
    textColor: "{colors.chocolate}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  nav-bar:
    backgroundColor: "{colors.nav-maroon}"
    textColor: "{colors.white}"
    height: "88px"
---

# Design System: VFoods COOKIEVERSE

## Overview

**Creative North Star: "The Warm Bakery at Golden Hour"**

VFoods is Thailand's **No.1 "ขนมปังปี๊บ"** (tin-packaged biscuit/snack) maker, and the site's job is to feel like a warm, appetizing, credible category leader — not a corporate factory page you skim. The system runs on the color of caramelizing sugar and toasted cookie — deep clip-orange, chocolate, and a single beam of golden highlight — so every surface reads as *appetizing before it reads as informational*. Warmth is the brand's whole argument: it is what makes 100+ products across 20+ brands feel like one family, and it is what earns an OEM client's trust.

The identity lives in **two coordinated worlds joined by one constant bar.** The home (`scroll-site/`) is the warm Persuade world: a saturated clip-orange stage (`#D6590C`) with deep-red panels and gold glow, led by **playful 3D-rendered snack mascots** (see Mascots below). The inner pages (products, brands, news, OEM, contact) are the sunlit Operate/Read world: a warm cream page (`#FFF6ED`) with chocolate text, where the catalog's real photography and real SKU data do the selling and the interface gets out of the way. Across both, the **orange navigation bar never changes** — it is the spine that makes a two-world site feel like one brand.

**Motion is playful, not cinematic-heavy.** The client's references are CPG brands (taokaenoi, rinbee) — packets that wiggle on click, video, varied friendly fonts, and a "VFoods" letter-convergence intro. The build deliberately runs on **native scroll + CSS + video + pre-rendered mascot art — no WebGL / 3D engine** (a past pass dropped GSAP/ScrollTrigger/Lenis for smoothness, and that is correct). Spectacle serves warmth and clarity, never the reverse. Anti-references are hard: no flat corporate template, no generic Bootstrap card grid, no cold minimal-white SaaS look, no stock-photo hero.

**Key Characteristics:**
- Warm, food-first palette — clip-orange, chocolate, and cream; gold used only as a highlight.
- Mascot-led personality: 3D-rendered snack characters carry the brand's charm.
- Two worlds, one bar: warm playful home vs. sunlit cream catalog, unified by a constant orange nav.
- Real over rendered on the catalog: true packshots and real dimensions, not decorative placeholders.
- AA contrast is a first-class constraint — small text on light backgrounds shifts to dark red, never bright orange.
- Playful-but-performant motion: CSS/native scroll/video only, no WebGL; the inner pages move mostly to reveal and confirm.

## Colors

A single warm hue family — orange caramelizing into red and chocolate — lit by one gold highlight, laid over either a dark stage (home) or warm cream (inner pages).

### Primary
- **Clip Orange** (`#D6590C`): The load-bearing brand color. It is the *background* of the COOKIEVERSE home stage and, on the light inner pages, the AA-safe accent for small text, active tabs, and links. One value, two jobs — this doubling is what ties the two worlds together.
- **Clip Orange Deep** (`#BF4A08`): The darker home-stage gradient stop and deepened panel edges.
- **Orange Primary** (`#FF6D1A`): The bright inner-theme accent — filter/tab fills, focus tints, iconography. Vivid, but never carries small body text (fails AA on cream).
- **Orange Bright** (`#F07800`): The interactive orange of the nav search button and hover accents.

### Secondary
- **Gold** (`#FFD35C`) & **Gold Deep** (`#E8A81E`): The golden highlight. Reserved for hero accent words, stat numbers, and glow (`text-shadow` with `--cv-glow`). Rarity is the point — see the One Beam Rule.
- **Orange Soft** (`#FF9E5C`): Warm accent for footer headings, eyebrows on dark sections, and secondary highlights.

### Tertiary
- **Panel Red** (`#8C1F06`) & **Burgundy Deep** (`#651313`): Deep-red glass panels on the home and the dark-burgundy scene backgrounds (flavor tunnel, social section) on inner pages.
- **Red Badge** (`#E51A1D`): The VFOODS logo badge only. Not a general accent.

### Neutral
- **Cream** (`#FFF6ED`): The inner-page background — warm off-white, never pure `#FFF`. Pure white is reserved for cards and panels sitting *on* the cream.
- **Cream Panel** (`#FFF8EF`) / **Warm White**: The cream text color on the dark home world.
- **Chocolate** (`#2B1B16`): Primary text on all light pages; also the `.btn-dark` fill.
- **Chocolate Ink** (`#240604`): The deepest background — home dark sections and footer.
- **White** (`#FFFFFF`): Card and form surfaces on the cream pages; text on all dark/orange surfaces.

### Named Rules
**The Dark-Red Small-Text Rule.** On any light background, text below ~16px must use **Clip Orange `#D6590C` (dark red), never bright `#FF6D1A`.** Bright orange small text measures ~2.7–3.9:1 on cream and fails WCAG AA. This rule is enforced repeatedly in `theme-white.css` (eyebrows, tags, labels, brand names) and must survive every edit.

**The One Beam Rule.** Gold is a highlight, not a fill. It appears on ≤1 element per viewport — a hero accent word, a stat number, a single glow. If two things are gold, one of them is wrong.

**The Warm-White Rule.** Backgrounds on light pages are cream (`#FFF6ED`) or true white for cards — never a cold gray or blue-white. The absence of any cool neutral is deliberate; it keeps the whole site inside the "food" temperature.

## Typography

**Display Font:** FC Vision Rounded (bundled woff2, weights 100–900) with **Sarabun** fallback
**Body Font:** Sarabun (300–800, Google Fonts)
**Thai text:** always renders in Sarabun (FC Vision Rounded is Latin-first; Sarabun carries every Thai glyph)

**Character:** FC Vision Rounded is a rounded, friendly, confident display face that gives Latin headlines a soft-edged, snack-brand warmth; Sarabun is a clean, highly legible humanist sans that handles Thai and all body copy. The pairing is warm-but-trustworthy — playful enough for a snack world, clear enough for spec tables and OEM detail. On the inner pages FC Vision Rounded is applied globally (`body, body *`) with Sarabun as the automatic fallback; the COOKIEVERSE home stays entirely in Sarabun (weight 800) for its cinematic headings.

### Hierarchy
- **Display** (700–800, `clamp(2rem, 6vw, 4.2rem)`, line-height 1.05, letter-spacing -0.04em): Page-hero H1 and the home hero. Tight, large, high-contrast.
- **Headline** (700, `clamp(1.8rem, 4.5vw, 3rem)`, line-height 1.1, letter-spacing -0.03em): Section titles (`.sec-title`).
- **Title** (600–700, ~1.1–1.5rem): Card names, brand names, sub-section heads.
- **Body** (300, ~0.95rem, line-height 1.8–1.85, max ~560–580px): Section descriptions and paragraphs. Note the **light 300 weight** for running copy — a signature of the system.
- **Label / Eyebrow** (600, ~0.68–0.72rem, letter-spacing 0.16–0.22em, UPPERCASE): Section eyebrows (`.sec-eye`), tags, form labels. Often flanked by short hairlines.

### Named Rules
**The Light-Body Rule.** Running paragraph text is weight **300**, not 400. It keeps the warm pages feeling airy and premium. Headlines carry the weight; body stays light.

**The Uppercase-Eyebrow Rule.** Every section opens with a small, wide-tracked, uppercase eyebrow in dark red or orange-soft — the recurring rhythmic beat that structures every page.

## Layout

A centered, generous editorial column, not a dense dashboard. Content sits in a `max-width: 1200px` container with `24px` side padding. Vertical rhythm is driven by a **`88px` section pad** (`.section { padding: 88px 0 }`) — the same number as the nav height, which is intentional breathing room.

Grids are simple and honest: `.grid-2 / .grid-3 / .grid-4` at `20px` gaps, collapsing to 2-up at ≤900px and 1-up at ≤560px. The footer runs a `2fr 1fr 1fr 1fr` grid down to 2-col at 768px and 1-col at 480px. Page heroes are centered with an eyebrow → H1 → sub-paragraph stack.

Spacing scale in use: `8 / 16 / 24 / 32 / 48px` (the `.mt-*` utilities) with `88px` for section separation. Breakpoints that matter: **1080px** (nav condenses), **900px** (nav → hamburger, grids halve), **768px / 560px / 480px** (footer and grid collapse).

## Elevation & Depth

A **hybrid**: the inner pages are near-flat and lift only on interaction; the home world builds depth from light, glow, and layered translucency rather than hard shadows.

On cream pages, cards rest almost flat (`0 2px 12px rgba(255,109,26,.06)` — a faint *warm-tinted* shadow, not neutral gray) and rise on hover with a `translateY(-6px)` and a deeper warm shadow. The signature move is that **shadows on light pages are tinted orange**, never black — depth stays inside the warm temperature. The home world uses `--glow` (`0 0 32px rgba(255,140,0,.6)`) and gold text-glow for a lit, volumetric feel.

### Shadow Vocabulary
- **Rest (warm)** (`box-shadow: 0 2px 12px rgba(255,109,26,.06)`): Cards at rest on cream.
- **Hover lift** (`box-shadow: 0 8px 28px rgba(255,109,26,.14)` + `translateY(-6px)`): Cards on hover.
- **Deep panel** (`--sh2: 0 14px 52px rgba(0,0,0,.28)`): Home-world glass panels and modals.
- **Glow** (`--glow: 0 0 32px rgba(255,140,0,.6), 0 0 80px rgba(255,100,0,.2)`): Home-only accent glow; do not port to cream pages.

### Named Rules
**The Warm-Shadow Rule.** On light pages, every shadow is tinted orange (`rgba(255,109,26,…)`), never neutral black. **The Lift-On-Intent Rule.** Cream cards are flat at rest; elevation is a *response* to hover/focus, ~6px of travel with a warm shadow.

## Shapes

Soft, rounded, friendly — matched to the rounded display type. Radii step: **`8px`** (buttons, eyebrow chips), **`11px`** (nav links, `.btn-dark`), **`16px`** (`--r`: dropdowns, standard cards), **`24px`** (`--r2`: glass cards), **`36px`** (`--r3`: large feature panels), and **`50px` pill** (search field, hero pills, some CTAs). Borders are hairline and *warm* — `1px solid rgba(255,109,26,.12–.18)` on cream, `1px solid rgba(255,255,255,.14–.22)` on dark. Nothing is sharp-cornered; the form language has no right angles that read as "corporate box."

## Components

### Buttons
Nuxt-UI language: rounded, medium weight, ring/outline for secondary, **color-transition hover with no bounce** on the inner theme.
- **Shape:** `8px` radius (`.btn-w`, `.btn-outline`); `11px` for `.btn-dark`.
- **Primary (`.btn-w`):** On cream pages, solid **Clip Orange `#D6590C`** with white text (AA-safe), `12px 22px` pad, faint shadow. Hover → `#B8480A`, deeper warm shadow, **no transform**. *(On the home world only, the same class is white-on-orange.)*
- **Outline (`.btn-outline`):** Transparent with a `1px` inset ring (`rgba(142,27,24,.5)` on cream / `rgba(255,255,255,.45)` on dark), dark-red or white text. Hover thickens the ring and adds a faint orange wash.
- **Dark (`.btn-dark`):** Chocolate `#2B1B16` fill, white text, `13px 32px`, `11px` radius. This one *does* lift (`translateY(-4px)`) — reserved for high-emphasis CTAs.
- **Focus:** All buttons show a visible `2px` outline (`--og5`) at `2px` offset on `:focus-visible`.

### Cards / Containers
- **Corner Style:** `16–24px` radius.
- **Background:** On cream pages, **solid white** — the `.glass-card` translucency of the home world is explicitly flattened to `#FFF` on inner pages for legibility. `.prod-card` / `.brand-card` are white with a warm hairline border.
- **Shadow Strategy:** Warm-tinted, per the Warm-Shadow Rule; lift on hover.
- **Border:** `1px solid rgba(255,109,26,.12)`, deepening to `.30–.35` on hover.
- **Internal Padding:** `20–24px`.

### Inputs / Fields
- **Style:** `#FAFAFA` fill, `1px` warm border (`rgba(255,109,26,.15)`), `8px` radius, chocolate text.
- **Focus:** Background warms to `#FFF8F8`, border → `rgba(255,109,26,.5)`, plus a `3px` orange focus ring (`rgba(255,109,26,.08)`).
- **Placeholder:** `rgba(43,27,22,.3)`.

### Navigation
The one constant across the whole site. **The nav bar is orange on every page, in every state.**
- **Style:** Fixed, `88px` tall (`74px` mobile), maroon base (`rgba(142,27,24,.97)`) with `blur(14px)`; on scroll it solidifies to `#6E2A05`. Bottom hairline `rgba(255,255,255,.14)`.
- **Logo:** VFOODS wordmark image (`img/logo-vfoods.png`, 56px / 44px mobile) or the italic "วีฟู้ดส์" text lockup with a red `#E51A1D` badge.
- **Links:** Uppercase Sarabun, `.94rem`, weight 600, `11px` radius; hover/active fills `rgba(255,255,255,.18)`.
- **Dropdowns:** CSS-only hover mega-menus (`#D05E00` panel, `16px` radius) with an invisible `::before` bridge so the mouse never drops the menu. Products = 2-col, Brands = 3-col.
- **Search:** White pill (`50px`) on the right, orange `#F07800` circular submit button; Enter → `products.html?q=…`.
- **Mobile (≤900px):** Links/search hide, hamburger reveals a `#D05E00` slide-down panel.

### Signature — Mascots (two treatments)
The brand's charm is carried by **3D-rendered snack-character mascots**, used two distinct ways (per the client brief):
- **Home hero — the walking band.** A row of snack characters (cracker, wafer roll, swirl/flower cookie, star cookie…) *walking across a crosswalk* (Abbey-Road style) greets the visitor on entry, before the page scrolls into company info. Playful, warm, immediately on-brand.
- **OEM guide — คุกกี้น้อย, the step guide.** A single mascot — an **orange-cap cookie carrying a "V"** — *walks the visitor through each OEM step* (a horizontal scroll-scrub journey), then the page presents real client logos and the factory. This is the guided-tour device, not a decoration.

Both are pre-rendered art driven by CSS/native scroll — never a WebGL/3D-engine build. The chocolate brand cursor (`cursor-choco-arrow.svg` / `-hand.svg`) applies site-wide; **no surface uses `cursor: none`** (the old custom-cursor experiment was removed).

### Trust row (certifications)
A row of certification marks — **FSSC 22000 · HACCP · GMP · HALAL · Thailand Trust Mark** — appears on the home as a credibility beat. Render as consistent circular/badge marks; these are the only certs to show (see PRODUCT.md).

## Do's and Don'ts

### Do:
- **Do** keep the nav bar orange (maroon `#8E1B18` → `#6E2A05` scrolled) on every page and every scroll state — it is the brand spine.
- **Do** use **dark red `#D6590C`** for small text, tags, eyebrows, and active tabs on light backgrounds (the Dark-Red Small-Text Rule) — bright orange there fails AA.
- **Do** tint shadows warm (`rgba(255,109,26,…)`) on cream pages and let cards lift ~6px only on hover.
- **Do** open every section with a wide-tracked uppercase eyebrow, and set running body copy in Sarabun **weight 300**.
- **Do** use real product photography and real SKU/dimension data in the catalog; prefer authentic over decorative.
- **Do** lead with the mascots and keep motion playful-but-light — CSS/native scroll/video, packet-wiggle-on-click energy à la taokaenoi.
- **Do** show the real OEM client logos (`ลูกค้าของเรา/`) and the cert row on the pages the brief calls for (OEM guide, home).

### Don't:
- **Don't** put bright `#FF6D1A` or gold on small text over cream — reserve bright orange for fills and gold for a single highlight (One Beam Rule).
- **Don't** use pure `#FFF` as a page background or any cold gray/blue neutral — the page is warm cream `#FFF6ED`.
- **Don't** carry the home's translucent glass cards onto inner pages; flatten them to solid white for legibility.
- **Don't** reach for WebGL / a 3D engine / heavy scroll libraries — the brief never asks for it; keep it native and fast.
- **Don't** ship a flat corporate template, a generic Bootstrap card grid, a cold minimal-white SaaS layout, or a stock-photo hero — the confirmed anti-references.
- **Don't** use neutral black shadows or sharp right-angled "box" corners; the form language is soft and warm throughout.
- **Don't** fabricate certs, metrics, or clients — show only the five confirmed certs and the real logos in `ลูกค้าของเรา/` (see PRODUCT.md).
