---
name: Lumina Digital
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ddb7ff'
  on-tertiary: '#490080'
  tertiary-container: '#b76dff'
  on-tertiary-container: '#400071'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
  stack-xl: 96px
---

## Brand & Style
The design system is engineered for a premium, founder-led digital growth agency, emphasizing high-craft execution and cinematic immersion. The aesthetic merges **Modern Minimalism** with **Glassmorphism**, creating a sense of depth and technical sophistication. 

The target audience consists of high-growth founders and enterprise leaders who value precision, innovation, and an editorial edge. The UI should evoke a sense of "quiet luxury" in tech—using expansive whitespace (even in dark mode), precise motion, and subtle glowing elements to guide the user through a curated digital experience.

## Colors
This design system utilizes a "Deep Space" palette. The foundation is a Charcoal Black (`#0A0A0B`) which serves as the canvas for high-contrast **Warm White** typography. 

- **Primary & Accent:** An "Electric Spectrum" of Blue, Indigo, and Purple is used for interactive elements and brand accents. These colors should often be applied as subtle gradients or glow effects rather than solid blocks.
- **Functional Emerald:** Used sparingly for trust signals, success states, and growth metrics, maintaining a soft, non-clinical glow.
- **Gradients:** Use linear gradients from Primary to Tertiary at 45-degree angles for high-impact visual headers or primary call-to-action buttons.

## Typography
The typography strategy pairs the expressive, high-character **Bricolage Grotesque** for headlines with the hyper-functional, developer-grade **Geist** for body copy. 

- **Headlines:** Should use tight tracking and generous line-height to maintain an editorial feel. Display sizes are intended for hero sections and should utilize the "Bricolage" character to feel custom-crafted.
- **Body:** Geist provides a technical, clean "Linear-style" readability that balances the organic nature of the headings.
- **Scale:** Use dramatic scale shifts between headlines and body text to establish a clear information hierarchy.

## Layout & Spacing
The layout follows a **Fluid Grid** model with significant vertical "breathing room" to maintain the luxury feel. 

- **Desktop:** 12-column grid with a 1280px max-width. Use 64px side margins to isolate content and focus the eye.
- **Rhythm:** Utilize large vertical stacks (`96px` or `1280px`) between major sections to emphasize an editorial, cinematic scroll experience.
- **Alignment:** Content should be centered or asymmetrical (spanning columns 1-8 or 5-12) to create visual interest.

## Elevation & Depth
Depth is created through **Glassmorphism** and light-based hierarchy rather than traditional shadows.

- **Surfaces:** Use semi-transparent layers (`rgba(255, 255, 255, 0.05)`) with a `20px` backdrop blur. 
- **Borders:** "Ghost borders" are essential. Use 1px solid strokes with low opacity (`rgba(255, 255, 255, 0.1)`) to define shapes without adding visual weight.
- **Glows:** Primary interactive elements should have an ambient outer glow using the Primary or Secondary color at 15% opacity, creating a "pulsing" or "emanating" light effect.
- **Z-Index:** Content layers should feel like they are floating in a vacuum, with the furthest background layers containing very subtle, large-scale radial gradients (30% blur) of Indigo or Purple.

## Shapes
This design system uses **large, generous rounded corners** to soften the technical edge of the dark theme. 

- **Standard Elements:** Buttons and small cards use a `16px` (rounded-lg) radius.
- **Container Elements:** Large sections, feature cards, and modal windows must use `24px` or `32px` radii to emphasize the modern, premium hardware-inspired look (similar to high-end mobile OS interfaces).

## Components
- **Buttons:** Primary buttons feature a subtle gradient (Electric Blue to Indigo) with a white label. Secondary buttons are "Glass" style—transparent with a 1px white border at 20% opacity and a backdrop blur.
- **Cards:** No solid background. Use the 20px blur glass effect with a subtle 1px border. Hover states should increase border opacity and introduce a faint primary glow.
- **Inputs:** Darker than the background (`#000000`) with a 1px border. On focus, the border transitions to a Primary-to-Secondary gradient.
- **Chips/Labels:** Small, all-caps Geist Mono text. Backgrounds are high-contrast with the primary color at 10% opacity.
- **Glass Trays:** Floating navigation bars or footer elements should use the maximum glassmorphism settings (0.1 opacity, 20px blur) to feel like they sit "above" the content scroll.
- **Visual Dividers:** Use vertical or horizontal lines with a 0.1 opacity white-to-transparent gradient to subtly separate content without hard breaks.