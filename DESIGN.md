# VarsityQuest Design System Specification

Welcome to the official Design System Specification for **VarsityQuest**, a production-grade College Discovery and Decision-Making Platform. This document outlines the color palette, typography, spacing scale, design elements, and interactive component specs retrieved from the VarsityQuest project via Stitch.

---

## Brand & Style
The design system is engineered to provide a trustworthy, academic, and highly efficient exploration experience for students and parents. The brand personality is professional and authoritative, yet accessible, stripping away the visual clutter typically found in Indian educational portals to focus on data clarity and decision-making.

The visual style follows a **Corporate / Modern** aesthetic with a strong emphasis on **Minimalism**. It utilizes a structured, card-based layout that prioritizes information hierarchy. By using a warm neutral background instead of pure white, the system reduces eye strain during long research sessions and creates a sophisticated, premium atmosphere that distinguishes the platform from more aggressive, advertisement-heavy competitors.

---

## 1. Color Palette

The VarsityQuest colors are selected to emphasize academic reliability and focus attention on data structures and key actions.

### Core Swatches
*   **Primary (Teal):** `#005c55` — Used for main selection states and brand identifiers.
*   **Primary Container:** `#0f766e` — The primary action/accent teal. Used for main buttons, interactive headers, and prominent badges.
*   **On-Primary / On-Primary-Container:** `#ffffff` / `#a3faef` — Contrast text colors on primary backgrounds.
*   **Secondary:** `#216963` — A slightly darker green-teal used for secondary elements and secondary text emphasis.
*   **Secondary Container:** `#a8ece5` — A soft teal fill for highlight chips and secondary active indicators.
*   **Tertiary (Gold/Yellow):** `#735c00` — Conveys quality, achievements, star ratings, and rankings.
*   **Tertiary Container:** `#cea700` — High-visibility container for key highlighted badges.
*   **Neutral Background / Canvas:** `#faf9f6` — A soft off-white surface that eliminates pure white eye-strain.
*   **Surface:** `#faf9f6` — The general surface color.
*   **Surface Containers:**
    *   `lowest`: `#ffffff` (Used for cards and main content sheets to pop out against the off-white canvas)
    *   `low`: `#f4f3f0`
    *   `default`: `#efeeeb`
    *   `high`: `#e9e8e5`
    *   `highest`: `#e3e2df`
*   **On-Surface / Typography:** `#1a1c1a` (Main text) and `#3e4947` (Secondary/muted text).
*   **Semantic Colors:**
    *   **Error:** `#ba1a1a`
    *   **On-Error:** `#ffffff`
    *   **Error Container:** `#ffdad6`
    *   **On-Error Container:** `#93000a`

### Full Theme Tokens Map (Material Design Token Equivalence)

| Token | Hex Value | Application |
|---|---|---|
| `background` | `#faf9f6` | Default app background |
| `on-background` | `#1a1c1a` | Text color on default background |
| `surface` | `#faf9f6` | Base component background |
| `surface-dim` | `#dbdad7` | Muted surface background |
| `surface-bright` | `#faf9f6` | Brightened surface background |
| `surface-container-lowest` | `#ffffff` | **Card backgrounds, inputs** |
| `surface-container-low` | `#f4f3f0` | Sub-sections, backgrounds |
| `surface-container` | `#efeeeb` | Gray containers |
| `surface-container-high` | `#e9e8e5` | Section borders or elevated surfaces |
| `surface-container-highest`| `#e3e2df` | Divided section dividers |
| `on-surface` | `#1a1c1a` | Main text on cards |
| `on-surface-variant` | `#3e4947` | Muted subtitle text on cards |
| `outline` | `#6e7977` | Strong border lines |
| `outline-variant` | `#bdc9c6` | Soft card borders / grid dividers |
| `primary` | `#005c55` | Brand identity / focus |
| `primary-container` | `#0f766e` | **Interactive primary buttons / Call to Actions** |
| `on-primary` | `#ffffff` | Primary text/icon color |
| `secondary` | `#216963` | Sub-actions, interactive text |
| `secondary-container` | `#a8ece5` | Soft badges and highlighting |
| `tertiary` | `#735c00` | Stars, active ranking metrics |
| `tertiary-container` | `#cea700` | Highlight labels |
| `error` | `#ba1a1a` | Negative feedback / Delete actions |

---

## 2. Typography

The design system utilizes **Geist** for its entire typographic scale. Geist’s technical, precise nature reflects the platform's data-driven approach to college discovery.

Headlines use a tighter letter-spacing and heavier weights to establish a clear hierarchy on information-dense pages. Body text is optimized for readability with generous line heights. Labels are set with slightly increased letter-spacing to ensure legibility when used in small UI elements like badges, table headers, or college tags. For mobile, display sizes are scaled down to prevent excessive wrapping while maintaining visual impact.

### Typographic Scale

| Style | Font Family | Size | Weight | Line Height | Letter Spacing | Use Case |
|---|---|---|---|---|---|---|
| `display-lg` | Geist | `48px` | `700` (Bold) | `56px` | `-0.02em` | Large hero page titles (Desktop) |
| `display-lg-mobile` | Geist | `32px` | `700` (Bold) | `40px` | `-0.02em` | Large hero page titles (Mobile) |
| `headline-lg` | Geist | `32px` | `600` (SemiBold)| `40px` | `-0.01em` | Section headers |
| `headline-md` | Geist | `24px` | `600` (SemiBold)| `32px` | `-0.01em` | Card/Sub-section titles |
| `headline-sm` | Geist | `20px` | `600` (SemiBold)| `28px` | `normal` | Inside card sections, side panels |
| `body-lg` | Geist | `18px` | `400` (Regular) | `28px` | `normal` | Sub-headers / Intro paragraphs |
| `body-md` | Geist | `16px` | `400` (Regular) | `24px` | `normal` | Standard readouts, descriptions, text |
| `body-sm` | Geist | `14px` | `400` (Regular) | `20px` | `normal` | Muted descriptors, secondary table rows |
| `label-lg` | Geist | `14px` | `600` (SemiBold)| `20px` | `0.02em` | Primary buttons, table headers, stats |
| `label-sm` | Geist | `12px` | `500` (Medium) | `16px` | `0.04em` | Badges, chips, ratings, tags |

---

## 3. Layout & Spacing

The layout follows a **Fixed Grid** model on desktop and a fluid model on mobile. Spacing rhythm uses a strict **4px baseline scale**.

### Spacing Scale & Token System
*   `xs`: `4px` — Micro-gaps (e.g. text to tiny icon, small border padding).
*   `sm`: `8px` — Inner elements of components (e.g. spacing between rating stars, title to tag gap).
*   `md`: `16px` — Standard component padding (e.g. inner padding of cards, text line separations).
*   `lg`: `24px` — Component-to-component spacing (e.g. gaps in grids, section side margins on tablet).
*   `xl`: `48px` — Large section dividers to preserve white space and avoid visual clutter.

### Layout Containers
*   **Desktop:**
    *   12-column grid.
    *   Max-width container: `1280px`.
    *   Gutter width: `24px`.
    *   Side margins: `48px`.
*   **Tablet:**
    *   8-column grid.
    *   Gutter width: `24px`.
    *   Side margins: `24px`.
*   **Mobile:**
    *   4-column fluid grid.
    *   Gutter width: `16px`.
    *   Side margins: `16px`.

---

## 4. Shapes & Roundness

The shape language is defined as **Rounded**, utilizing a **0.5rem (8px)** base radius. This creates a friendly yet professional appearance that feels modern and approachable.

*   `sm`: `0.25rem` (`4px`) — For interactive small elements like badges, tags, chips, and small icons.
*   `DEFAULT`: `0.5rem` (`8px`) — Base radius. Used for buttons, input fields, checkboxes, and small utility components.
*   `md`: `0.75rem` (`12px`) — For list cards and sub-section cards.
*   `lg`: `1rem` (`16px`) — For main structural components, college cards, and large containers.
*   `xl`: `1.5rem` (`24px`) — For massive banners, bottom sheets, or highly distinct floating layout trays (e.g. Comparison Tray).
*   `full`: `9999px` — Used for profile avatar circles or pill-like filters.

---

## 5. Elevation & Depth

Visual depth is created through **Tonal Layers** and **Ambient Shadows** instead of heavy overlays, maintaining a flat, professional academic design.

*   **Level 0 (Background):** `#faf9f6` — The base canvas color.
*   **Level 1 (Surface Cards):** Pure White (`#ffffff`) background with a 1px soft border in `#e5e7eb` (Gray-200) or `#bdc9c6` (`outline-variant`).
*   **Level 2 (Active/Hover):** Soft ambient shadow added on hover for tactile responsiveness:
    `0 4px 12px rgba(0, 0, 0, 0.05)`
*   **Level 3 (Overlay Modals / Dropdowns):** A pronounced soft shadow to separate high-level interactions:
    `0 12px 32px rgba(0, 0, 0, 0.1)`

---

## 6. Key Components UI Spec

### Buttons
*   **Primary Button:**
    *   Solid `#0f766e` (Teal) background with `#ffffff` text.
    *   Corner radius: `8px` (`DEFAULT`).
    *   Typography: `label-lg` (Geist 14px, SemiBold).
    *   Hover state: Shift to Dark Teal (`#115e59`).
*   **Secondary Button:**
    *   Teal outline (`#0f766e`) with a transparent background.
    *   Hover state: Light teal tint overlay.

### College Cards
*   **Container:** Pure white (`#ffffff`) background, 16px corner radius (`lg`), and a 1px border using `outline-variant` (`#bdc9c6`).
*   **Header:** Image banner at top with a high-contrast aspect ratio, containing a rating tag (`label-sm` with gold star) and a "Save" heart icon overlay in the top right.
*   **Stats Row:** Horizontal split row displaying core stats (Total Fees, Average Package, Ranking) using `label-lg` for labels and simple minimal icons.

### Search & Filters
*   **Search Bar:** Level 1 white surface with a 16px corner radius, a leading magnifying glass icon, and a trailing filter badge on mobile.
*   **Filters Sidebar:** Checkbox groups with clean margins. Active filters appear as rounded-pill chips (`full` roundness) in a horizontal wrap bar, colored in Teal with white text and an `×` close icon.

### Comparison Tray & Table
*   **Tray:** A persistent bottom bar that slides up from the viewport. Features a `rounded-t-2xl` layout and a subtle Level 3 shadow. Shows college chips with remove buttons.
*   **Table:** Sticky left column for college names. Alternating zebra-striped rows using the background canvas `#faf9f6`. Winning fields (e.g. lowest fees or highest placements) are highlighted with a very soft Teal tint and left Teal border line.

### Input Fields
*   **Base:** Pure white surface, `8px` radius, 1px border.
*   **Focus State:** Border changes to `primary-container` (`#0f766e`) with a 2px offset focus ring.
