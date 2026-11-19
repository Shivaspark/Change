---
name: Change Raw Ink
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system expresses financial tracking through tactile human craft: a stark, monochrome notebook doodle aesthetic that removes corporate sterility and transforms budgeting into an approachable personal journal. The interface balances high-contrast editorial minimalism with deliberate hand-drawn imperfection—thick ink lines, unpolished sketch containers, and expressive line-weight dynamics that evoke felt-tip markers on crisp, heavyweight cardstock.

Targeted at visually discerning individuals and mindful spenders fatigued by cold corporate fintech dashboards, the aesthetic elicits intimacy, transparency, and creative agency. While structural elements remain purely black, white, and graphite gray, a solitary chromatic anomaly exists: an electric multi-hued voice gradient reserved strictly for active AI listening interactions, symbolizing a synthetic intellect sparking across physical paper.

## Colors

The palette operates under absolute monochrome discipline, establishing stark structural contrast while reserving chromatic energy exclusively for generative AI voice input.

- **Primary (`#000000`)**: Deep Indian ink black. Used for prominent borders, foundational strokes, dense typography, bold icons, and solid interactive actions.
- **Secondary (`#4A4A4A`)**: Dark charcoal graphite. Applied to supporting labels, secondary data points, and intermediate line hatchings.
- **Tertiary (`#8A8A8A`)**: Medium slate pencil gray. Used for subtle category rules, inactive states, timestamp details, and auxiliary graph tick marks.
- **Neutral Light (`#F5F5F5` to `#FFFFFF`)**: Pure bright chalk white for screen surfaces, paired with occasional `#EFEFEF` washes for filled sketch containers and segmented controls.
- **AI Signature Aura (`#7C3AED` to `#06B6D4` to `#EC4899`)**: An energetic tri-stop gradient (Violet, Cyan, Hot Magenta) applied exclusively to the AI Gemini floating action button ring and live acoustic waveforms during voice ledger logging. No other surface or interaction may sample these hues.

## Typography

Typography fuses expressive, marker-like forms with mechanical monospace clarity to deliver a balanced ledger feel.

- **Headline Display**: Bricolage Grotesque supplies exaggerated, organic ink-traps and playful character cuts that simulate thick felt-tip marker strokes without sacrificing optical balance.
- **Body & Metrics**: Space Grotesk provides a technical yet friendly structure for monetary accounts, daily logs, and transactional narration.
- **Labels & Micro-data**: JetBrains Mono serves dates, percentages, category codes, and receipt serial tags with the precision of a printed thermal cash register receipt.

## Layout & Spacing

The layout is built upon a mobile-first 4-column layout matrix, scaling to an 8-column layout on tablet views. Spacing deliberately emphasizes generous pure-white borders and intentional margins to evoke sketchbook framing.

- **Grid Alignment**: Horizontal items anchor against a strict 4px sub-pixel line mesh. Cards feature variable vertical padding to simulate hand-drawn spacing.
- **Margins & Safe Zones**: Canvas gutters remain at `1rem` on compact displays, creating an expansive breathing buffer around dense transaction ledgers.
- **Stack Rhythm**: Group transaction rows with `space-xs` (4px) gaps to simulate tight notebook line ruling; separate monthly overview modules with `space-xl` (36px) gaps to prevent cognitive overload.

## Elevation & Depth

This design system discards soft ambient drop shadows and skeuomorphic blur in favor of hard-edged, neo-brutalist ink offsets and structural border weights.

- **Zero-Blur Ink Offset Shadows**: Elevation is achieved via solid black silhouettes shifted down and right with no blur (`box-shadow: 3px 3px 0px #000000`). Pressed and interactive states collapse this offset to `0px 0px 0px` with a matching `transform: translate(2px, 2px)`.
- **Stroke Hierarchies**:
  - Primary boundary frames utilize heavy 2.5px solid `#000000` contours.
  - Secondary containers and transaction cards use 1.5px solid `#000000` outlines.
  - Category divisions and grid guidelines employ 1px dashed or crosshatched `#4A4A4A` lines.
- **Layered Collage Depth**: Floating overlays (such as bottom sheets and receipt scanners) rest over a 20% opacity coarse stipple screen (SVG ink dot-matrix pattern) rather than a flat gray veil.

## Shapes

Shapes emulate organic, hand-cut paper cards and freeform sketch borders while preserving functional digital precision.

- **Base Curvature**: Geometry favors `roundedness: 1` (subtle 4px base radii). Elements avoid perfect circles except for currency tags, small icon badges, and the circular AI voice trigger.
- **Irregular Borders**: Key module borders can utilize slight asymmetric SVG corner masks or non-uniform border radius combinations (e.g., `4px 6px 3px 5px`) to reproduce the human inconsistency of hand-drawn boxes.
- **Scribble Accents**: Tab indicators, active pill markers, and total budget strike-throughs employ SVG vector sketches that resemble rapid freehand ink loops.

## Components

- **Buttons**:
  - *Primary Button*: Pure white background with a 2px `#000000` border, heavy bold text in Bricolage Grotesque, and a solid `3px 3px 0px #000000` offset shadow. Active tap collapses to `0px 0px` offset.
  - *Secondary Button*: Transparent surface with a 1.5px dashed border (`#000000`) and monospace label.
  - *AI Voice FAB*: Floating action circle (56px) enclosed within an animated 3px gradient border (`#7C3AED` to `#06B6D4` to `#EC4899`). The button core stays pure `#000000` with an animated white microphone waveform glyph that pulses during voice recording.

- **Cards & Ledger Containers**:
  - Encased in 2px continuous black strokes.
  - Daily spending totals feature rough hand-drawn ink underlines or squiggly divider vectors (`border-image` or embedded SVG paths).
  - Background is stark `#FFFFFF`, contrasting with child tags washed in `#F5F5F5`.

- **Input Fields**:
  - Bottom-border-only input fields resembling notebook ruled lines (2px solid `#000000`).
  - Active focus manifests as a double black stroke or simulated ink bleed bar. Monospace numeric labels for amounts with oversized decimal currency glyphs.

- **Chips & Filter Pills**:
  - Category chips (e.g., `FOOD`, `TRANSIT`, `GEAR`) use 1px solid black boundaries with JetBrains Mono text.
  - Selected state applies a reverse solid black fill (`#000000`) with high-contrast `#FFFFFF` text.

- **Checkboxes & Radios**:
  - Hand-drawn box glyphs that toggle an authentic vector "X" or scribbled diagonal checkmark instead of sterile geometric check icons.
  - Radios resemble freehand unfilled circles that gain a rapid black marker swirl when selected.

- **Charts & Financial Gauges**:
  - Progress bars use black diagonal crosshatch fills (`repeating-linear-gradient(45deg, #000, #000 2px, #fff 2px, #fff 6px)`) rather than smooth color fills to represent budget consumption.
  - Sparklines and trend diagrams feature stepped or hand-traced paths with visible ink dot vertex anchors.