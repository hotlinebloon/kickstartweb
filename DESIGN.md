---
name: Kickstart 11-Step Prototype
description: White-and-blue intern matching product on a full blueprint workspace background.
colors:
  background: "#f2f7fd"
  surface: "#ffffff"
  surface-muted: "#edf4fb"
  text: "#181716"
  muted: "#53677d"
  border: "#d7e3ee"
  primary: "#2563eb"
  primary-dark: "#1d4ed8"
  blueprint: "#1e3a5f"
  danger: "#b91c1c"
  success: "#0f766e"
  warning: "#92400e"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 750
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 650
    lineHeight: 1.2
rounded:
  input: "12px"
  compact-card: "14px"
  panel: "16px"
  card: "18px"
  feature-card: "24px"
  hero-card: "26px"
  pill: "999px"
spacing:
  xs: "0.35rem"
  sm: "0.65rem"
  md: "1rem"
  lg: "1.5rem"
  page-y: "42px"
  page-x: "20px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1rem"
    height: "38px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1rem"
    height: "38px"
  badge-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.65rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "1.15rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.input}"
    padding: "0.75rem 0.9rem"
    height: "42px"
---

# Design System: Kickstart 11-Step Prototype

## 1. Overview

**Creative North Star: "The Growth Ledger"**

Kickstart should feel like a clear operating surface for paid opportunities and intern development. The system records decisions, proof, task movement, and progress with a serious but human tone. Employers should trust it enough to post and pay; applicants should understand what evidence helps them move forward.

The redesigned direction is a white-and-blue product shell on top of a full blueprint workspace background. The blueprint is the environment of the web, suggesting structured matching and planning. Application cards, forms, and decision panels should stay clean, white, and readable above that background.

**Key Characteristics:**

- Restrained white-and-blue product palette with blue reserved for primary actions, navigation, active states, links, and focus.
- Rounded but structured containers, usually 14px to 18px, with larger radii only on hero or feature cards.
- Dense enough for dashboards, but organized into clear role-based flows.
- Status language must pair color with words, counts, shape, or position.
- The blueprint background is visible across the app, while content surfaces stay white and serious.

## 2. Colors

The palette is a white-and-blue product system. Blue is the main system color; red is reserved for destructive or negative actions.

### Primary

- **System Blue** (`#2563eb`): Primary buttons, active route buttons, links, focus rings, selected items, progress fills, and focused application states.
- **Deep System Blue** (`#1d4ed8`): Hover state for primary actions and strong selected-state text.

### Secondary

- **Blueprint Blue** (`#1e3a5f`): Global blueprint background lines, matching-workspace identity, and deeper blue supporting marks.

### Tertiary

- **Growth Green** (`#0f766e`): Accepted placements, completed tasks, approved proof, and positive progress states.
- **Warning Brown** (`#92400e`): Warning badges where attention is needed without implying failure.
- **Danger Red** (`#b91c1c`): Reject, delete, error, danger, and critical warning actions only.

### Neutral

- **White Workspace** (`#f6f9fc`): Body background and quiet product shell.
- **Clean Surface** (`#ffffff`): Primary card, input, badge, button, and panel background.
- **Blue-Tinted Surface** (`#edf4fb`): Secondary panels, task columns, progress tracks, and soft cards.
- **Near Black Ink** (`#181716`): Primary text.
- **Operational Muted Text** (`#68635c`): Secondary text, descriptions, helper copy, and ghost buttons.
- **Soft Divider** (`#ded6cb`): Borders, dividers, input strokes, and card boundaries.

### Named Rules

**The Status Pairing Rule.** Never communicate state with color alone. Pair red, blue, green, warning, and danger with visible labels, counts, placement, or icons.

**The Destructive Red Rule.** Red is not the brand accent. Use it only for reject, delete, error, danger, and critical warnings.

**The Blueprint Environment Rule.** The web background can be blueprint. The application itself should not become dark: cards, forms, tables, and decision panels remain white or blue-tinted.

## 3. Typography

**Display Font:** Inter with system sans fallbacks  
**Body Font:** Inter with system sans fallbacks  
**Label/Mono Font:** Inter with system sans fallbacks

**Character:** The type system is direct, compact, and product-oriented. Heavy weights give headings confidence, while body and muted text stay plain enough for repeated operational use.

### Hierarchy

- **Display** (800+, `clamp(2.2rem, 5vw, 4.2rem)`, line-height `1`): Home page and major page titles.
- **Headline** (800+, `clamp(1.8rem, 3vw, 2.6rem)`, line-height `1.05`): Section headers, large panel titles, and feature-card headings.
- **Title** (750, `1.1rem`, line-height `1.25`): Card titles, task names, review section headings, and compact panel headings.
- **Body** (400, `1rem`, line-height around `1.55`): Interface copy, answers, descriptions, and task content. Keep prose around 65 to 75 characters per line where possible.
- **Lead** (400, `1.05rem`, line-height `1.65`): Introductory text on page headers.
- **Label** (650 to 800, `0.75rem` to `0.9rem`): Form labels, nav labels, badges, and short status text.

### Named Rules

**The Product Scale Rule.** Use fixed, repeatable type sizes for app screens. Fluid display type is acceptable on the home page and opportunity detail hero, but not inside dense dashboards.

**The Label Restraint Rule.** Uppercase tracked labels are allowed for short flow markers and badges, but do not put an eyebrow above every section by habit.

## 4. Elevation

Kickstart uses a hybrid of borders, tonal layering, and one light ambient shadow. Most surfaces are defined by `1px` borders and background contrast. Shadows are soft and low-contrast, used on major cards or feature panels rather than every nested element.

### Shadow Vocabulary

- **Ambient Card Shadow** (`box-shadow: 0 8px 20px rgba(30, 58, 95, 0.07)`): Use on major cards such as application cards, growth hero cards, profile heroes, and prominent discovery or apply panels.
- **Flat Panel** (`box-shadow: none`): Use for nested cards, task columns, badges, inputs, side panels, and review sections.

### Named Rules

**The Border-First Rule.** Default to border and tonal layer before adding shadow. Avoid pairing a `1px` border with a wide decorative shadow on every repeated card.

## 5. Components

### Buttons

- **Shape:** Fully pill-shaped (`999px`) with a minimum height of `38px`.
- **Primary:** System Blue background (`#2563eb`), white text, `0.65rem 1rem` padding, heavy label weight.
- **Hover / Focus:** Primary hover deepens to `#1d4ed8`. Use a visible blue focus ring for keyboard navigation.
- **Secondary:** Clean Surface background, Soft Divider border, Near Black Ink text.
- **Ghost:** Transparent background with muted text, used mainly for inactive nav links and lower-priority actions.
- **Danger:** Danger Red for destructive actions only.

### Chips

- **Style:** Pill badges with `1px` borders, subtle tinted backgrounds, and bold text.
- **State:** Default badges are neutral. Accent, blue, success, warning, and danger badges must include text that names the state.

### Cards / Containers

- **Corner Style:** Standard cards use `18px`; nested cards use `14px` to `16px`; feature and hero cards use `24px` to `26px`.
- **Background:** Clean Surface for primary content, Muted Surface for supporting columns and soft grouping.
- **Shadow Strategy:** Only major cards receive the ambient card shadow.
- **Border:** Soft Divider is the default border. Tinted borders may be used for active, success, warning, or danger states.
- **Internal Padding:** Compact panels use `0.85rem` to `1rem`; main cards use `1.15rem` to `1.35rem`.

### Inputs / Fields

- **Style:** Clean Surface background, Soft Divider border, `12px` radius, `42px` minimum height, and `0.75rem 0.9rem` padding.
- **Focus:** Currently neutral. Add a visible focus-visible outline or ring before shipping.
- **Error / Disabled:** Use explicit error text and disabled affordances, not color alone.

### Navigation

- **Style:** Sticky top navigation with Warm Workspace background, Soft Divider bottom border, two-row structure, and role-aware links.
- **Typography:** Logo is heavy and tight. Flow label is uppercase and compact. Active nav links use the primary button style, inactive links use ghost buttons.
- **Mobile Treatment:** Links wrap rather than collapse. Future polish should consider a denser mobile nav once route count grows.

### Task Boards and Status Flows

- **Task Columns:** Muted Surface background, `16px` to `20px` radius, `1px` border, minimum column widths, and horizontal overflow for four-column boards.
- **Task Cards:** Clean Surface, `14px` to `16px` radius, border-first depth.
- **Progress:** `10px` pill track in Muted Surface with Kickstart Red fill.
- **Timeline:** Numbered or state dots can use tinted success or active backgrounds, but must stay paired with labels and content.

## 6. Do's and Don'ts

### Do:

- **Do** keep the product register first: clear workflows, direct labels, familiar controls, and role-aware navigation.
- **Do** use `#2563eb` for primary actions, active states, selected items, links, focus rings, and progress.
- **Do** keep the global web background in the blueprint system and place clean white application cards above it.
- **Do** pair every status color with readable text, counts, shape, or placement for color-blind-safe understanding.
- **Do** use borders and tonal layers as the default depth system.
- **Do** keep dashboards scannable with visible section grouping, concise labels, and consistent card anatomy.
- **Do** target WCAG AA contrast and add reduced-motion alternatives for any future animation.

### Don't:

- **Don't** make Kickstart feel like generic SaaS, a childish app, swipe-app energy, a cluttered dashboard, or cold corporate software.
- **Don't** use red as a general accent. Red is only for reject, delete, error, danger, or critical warnings.
- **Don't** put the blueprint texture inside every application card or form. The background carries it; the content surfaces stay clean.
- **Don't** rely only on color for application states, task states, review decisions, or progress signals.
- **Don't** use decorative gradients, glassmorphism, or marketing-style hero metric blocks as the product vocabulary.
- **Don't** overuse uppercase tracked eyebrows above every section.
- **Don't** use side-stripe borders as a default callout pattern. Existing proof and rule boxes should be replaced with full borders, icons, or labeled callouts during polish.
- **Don't** push card radius past `26px` in this system. Most product surfaces should stay between `12px` and `18px`.
- **Don't** add display fonts to labels, buttons, badges, tables, or task boards.
