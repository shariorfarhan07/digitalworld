# Assets Required — iDigital World Website

Generate each asset manually in **Google Flow**, then save the file into the project using the exact target filename listed. The site is built with placeholders, so it works before these exist — each asset simply upgrades its scene when dropped in.

**Shared style rules for every prompt** (already baked into each prompt below):
charcoal near-black `#10131a` environment · electric blue `#4d8eff` · indigo `#3131c0` · violet `#b76dff` accents · cinematic volumetric lighting · quiet luxury · **no text, no logos, no people** · minimal film grain.

> Tip: if a generation comes back with visible text, fake logos, or people, regenerate — don't crop. If a "seamless loop" isn't seamless, that's fine; tell me and I'll crossfade the ends with ffmpeg when integrating.

---

## Asset 1 — Hero cinematic loop (VIDEO)

- **Target file:** `public/media/hero-loop.mp4`
- **Purpose:** The cinematic film inside the hero's large left media card; its glow bleeds into the page background.
- **Where used:** Hero section (arrival scene).
- **Why it improves the experience:** Carries most of the "product launch" premium feel; real light/glass motion can't be faked in CSS.
- **Resolution:** 1920×1080 · **Aspect ratio:** 16:9 · **Duration:** 8 s, seamless loop
- **Camera movement:** Extremely slow dolly-in (almost imperceptible), locked horizon, no shake.
- **Lighting:** Soft electric-blue key from upper right, violet bounce from below, deep charcoal falloff.
- **Style:** Abstract macro glass, Apple-event opening frame, quiet luxury.
- **Transparent background:** No.

**Google Flow prompt:**

```
Abstract cinematic scene: enormous slabs of dark smoked glass drift extremely slowly in a pitch-black charcoal void (#10131a). A soft electric-blue light source (#4d8eff) glows from the upper right, refracting through the glass edges as thin blue and violet caustic lines. Faint indigo volumetric haze in the deep background. Camera performs an almost imperceptible slow dolly-in, locked horizon, no shake. Minimal filmic grain, ultra-premium quiet-luxury mood, dark negative space dominates 70% of frame. No text, no logos, no people. Seamless loop, 8 seconds, 16:9.
```

**Veo 3 prompt:**

```
Slow cinematic macro shot of massive dark smoked-glass panels floating in a black charcoal void, edges catching electric blue and violet refracted light, soft indigo volumetric haze behind, almost imperceptible dolly-in, locked camera, 70% of the frame is dark negative space, quiet luxury aesthetic, seamless 8 second loop, no text, no people.
```

---

## Asset 2 — Floating glass panels (VIDEO)

- **Target file:** `public/media/glass-panels.mp4`
- **Purpose:** Depth backdrop behind the five service-pillar glass cards.
- **Where used:** Services / five pillars section, at ~35% opacity.
- **Why it improves the experience:** Makes the UI cards feel like they belong to a physical 3D space.
- **Resolution:** 1920×1080 · **Aspect ratio:** 16:9 · **Duration:** 10 s, seamless loop
- **Camera movement:** Slow lateral drift left→right, subtle parallax between panel layers.
- **Lighting:** Blue rim light on edges, violet fill grazing frosted surfaces, near-black background.
- **Style:** Weightless, architectural, precise — no bobbing or spinning.
- **Transparent background:** No (pure-black background version is ideal if possible — I composite it with screen blending).

**Google Flow prompt:**

```
Five thin translucent frosted-glass rectangles hover at different depths in a near-black charcoal space, arranged in a loose horizontal rhythm. Their thin edges glow faintly with electric blue (#4d8eff) rim light; a violet (#b76dff) fill light grazes the frosted surfaces. The camera drifts slowly left to right creating gentle parallax between the glass layers. Motion is slow, weightless, architectural and precise — no bobbing or spinning. Deep black background with a very subtle indigo radial glow far behind. No text, no logos, no reflections of objects. Seamless loop, 10 seconds, 16:9.
```

**Veo 3 prompt:**

```
Cinematic shot of five frosted translucent glass rectangles floating at staggered depths in a black void, edges rim-lit electric blue, violet fill light, camera drifting slowly sideways with gentle parallax, weightless and architectural motion, subtle indigo glow deep in background, seamless 10 second loop, 16:9, no text, no people.
```

---

## Asset 3 — Blueprint / network ambience (VIDEO)

- **Target file:** `public/media/blueprint.mp4`
- **Purpose:** Barely-visible technical texture behind the transparent process roadmap.
- **Where used:** Process section background at ~25% opacity (an SVG roadmap animates on top).
- **Why it improves the experience:** Reinforces "engineered, transparent process" without stealing focus.
- **Resolution:** 1920×1080 · **Aspect ratio:** 16:9 · **Duration:** 12 s, seamless loop
- **Camera movement:** Locked-off static camera, no movement.
- **Lighting:** Self-illuminated thin lines only, very low intensity.
- **Style:** Subtle animated blueprint grid / sparse node network.
- **Transparent background:** No.

**Google Flow prompt:**

```
Minimal animated blueprint texture on a near-black charcoal background (#10131a): an ultra-fine grid of hairline indigo lines at 10% brightness, with occasional thin electric-blue (#4d8eff) lines slowly drawing themselves between small glowing nodes, forming and dissolving a sparse network. Everything is extremely subtle and dim — background texture, not a focal point. Locked static camera, no camera movement. Precise, technical, calm. No text, no numbers, no logos. Seamless loop, 12 seconds, 16:9.
```

**Veo 3 prompt:**

```
Static locked-off shot of a barely visible dark blueprint texture: hairline indigo grid on near-black, thin electric blue lines slowly self-drawing between small glowing nodes then fading, sparse and dim, calm technical mood, seamless 12 second loop, 16:9, no text, no numbers, no people.
```

---

## Asset 4 — Founder scene light rays (VIDEO)

- **Target file:** `public/media/founder-light.mp4`
- **Purpose:** Quiet, human backdrop behind the founder's statement.
- **Where used:** Founder section, behind a glass text panel.
- **Why it improves the experience:** Shifts the emotional register from technical to personal without photography.
- **Resolution:** 1920×1080 · **Aspect ratio:** 16:9 · **Duration:** 10 s, seamless loop
- **Camera movement:** Locked-off static camera.
- **Lighting:** Warm-leaning white rays through haze over a faint blue ambient base; deep shadows lower right.
- **Style:** Contemplative, gallery-at-dusk minimalism.
- **Transparent background:** No.

**Google Flow prompt:**

```
Soft volumetric light rays fall diagonally from the upper left through fine atmospheric haze in a dark charcoal room (#10131a). The rays are warm white with a faint blue ambient base tone, slowly shifting in intensity as if clouds pass a distant window. Deep shadows dominate the lower right of frame. Extremely calm, contemplative, minimal — like light in an empty gallery at dusk. Locked static camera. No objects, no text, no people. Seamless loop, 10 seconds, 16:9.
```

**Veo 3 prompt:**

```
Locked-off cinematic shot of soft diagonal volumetric light rays passing through haze in a dark empty charcoal room, warm white light over a faint blue ambient base, intensity slowly breathing, deep shadow in lower frame, contemplative gallery-at-dusk mood, seamless 10 second loop, 16:9, no objects, no text, no people.
```

---

## Asset 5 — Hero poster / social share still (IMAGE)

- **Target files:** `public/media/hero-poster.webp` (poster) and `public/og.jpg` (social share — same image is fine)
- **Purpose:** Instant first frame for the hero video, reduced-motion fallback, and Open Graph share image.
- **Where used:** Hero video poster + `<meta og:image>`.
- **Why it improves the experience:** Guarantees a premium first paint at zero bandwidth and correct social previews.
- **Resolution:** 2400×1350 · **Aspect ratio:** 16:9 · **Duration:** n/a (still image)
- **Camera / Lighting / Style:** Match Asset 1's look — same scene as a still.
- **Transparent background:** No.

**Google Flow prompt (image mode):**

```
Still image: enormous slabs of dark smoked glass suspended in a pitch-black charcoal void (#10131a), edges refracting thin electric-blue (#4d8eff) and violet (#b76dff) caustic light lines, soft indigo volumetric haze deep in the background, 70% dark negative space, ultra-premium quiet-luxury aesthetic, minimal filmic grain, 16:9, no text, no logos, no people.
```

**Veo 3 prompt:** n/a — still image (use Flow's image mode).

---

## Asset 6 — Glass orb accent (IMAGE, optional polish)

- **Target file:** `public/media/orb.webp`
- **Purpose:** Physical accent object in the hero's right media card; reused beside the final offer/CTA scene.
- **Where used:** Hero right card + offer section (cropped off-canvas with slow parallax and glow).
- **Why it improves the experience:** One tangible object anchors the composition where everything else is typography and glass UI.
- **Resolution:** 1600×1600 · **Aspect ratio:** 1:1 · **Duration:** n/a (still image)
- **Camera movement:** Macro, centered subject.
- **Lighting:** Blue key upper-left, violet rim lower-right, on pure black.
- **Style:** Photoreal glass 3D-render aesthetic.
- **Transparent background:** **Yes if possible**; otherwise pure black background (I'll blend it in with screen blending + radial mask).

**Google Flow prompt (image mode):**

```
Still image: a single flawless sphere of clear glass with a swirling gradient core of electric blue (#4d8eff) fading to violet (#b76dff), photographed macro on a pure black background, blue key light upper left, violet rim light lower right, crisp refractions and a soft ambient glow around the sphere, photoreal 3D render quality, centered, 1:1, no text, no logos.
```

**Veo 3 prompt:** n/a — still image.

---

## Delivery checklist

| # | Asset | Type | Target file | Priority |
|---|-------|------|-------------|----------|
| 1 | Hero cinematic loop | Video 8s | `public/media/hero-loop.mp4` | High |
| 5 | Hero poster / OG still | Image | `public/media/hero-poster.webp` + `public/og.jpg` | High |
| 6 | Glass orb | Image | `public/media/orb.webp` | High |
| 2 | Floating glass panels | Video 10s | `public/media/glass-panels.mp4` | Medium |
| 4 | Founder light rays | Video 10s | `public/media/founder-light.mp4` | Medium |
| 3 | Blueprint ambience | Video 12s | `public/media/blueprint.mp4` | Low |

Any format Flow exports is fine (mp4/webm/png/jpg) — hand them over with the asset number and I'll compress, convert and integrate them.
