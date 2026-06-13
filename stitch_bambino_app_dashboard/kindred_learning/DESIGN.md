---
name: Kindred Learning
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#544434'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#877461'
  outline-variant: '#dac2ad'
  surface-tint: '#895100'
  primary: '#895100'
  on-primary: '#ffffff'
  primary-container: '#f69600'
  on-primary-container: '#5f3700'
  inverse-primary: '#ffb86b'
  secondary: '#5d5c74'
  on-secondary: '#ffffff'
  secondary-container: '#e2e0fc'
  on-secondary-container: '#63627a'
  tertiary: '#855400'
  on-tertiary: '#ffffff'
  tertiary-container: '#e49e3c'
  on-tertiary-container: '#5c3900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbc'
  primary-fixed-dim: '#ffb86b'
  on-primary-fixed: '#2c1700'
  on-primary-fixed-variant: '#683d00'
  secondary-fixed: '#e2e0fc'
  secondary-fixed-dim: '#c6c4df'
  on-secondary-fixed: '#1a1a2e'
  on-secondary-fixed-variant: '#45455b'
  tertiary-fixed: '#ffddb7'
  tertiary-fixed-dim: '#ffb95c'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
  background-cream: '#FFFAF2'
  surface-white: '#FFFFFF'
  accent-soft-gold: '#FFF1D6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 48px
---

## Brand & Style

This design system is built for the intersection of early childhood education and modern utility. It evokes a sense of safety, curiosity, and warmth, catering to both parents and young learners. The brand personality is optimistic and dependable, using a "Digital Playground" aesthetic—a sophisticated take on child-friendly design that avoids being juvenile.

The design style is **Soft Minimalism**. It prioritizes high-quality whitespace and a limited, vibrant color palette to reduce cognitive load. Interaction patterns are tactile and friendly, utilizing generous touch targets and soft, organic shapes to create a welcoming environment that feels native to the Apple ecosystem while maintaining a distinct, playful character.

## Colors

The palette is anchored by a warm, energetic orange that signals activity and creativity. This is balanced by a deep, scholarly midnight blue (secondary) which provides excellent contrast and grounding for text and navigation. 

Neutral tones are shifted away from pure blacks and greys toward "warm charcoals" to maintain the friendly atmosphere. Use the `background-cream` for large surface areas to reduce the harshness of pure white on young eyes, while reserving `surface-white` for elevated cards and input fields to create a clear visual hierarchy.

## Typography

The typography system uses **Plus Jakarta Sans** for headlines to provide a soft, geometric, and modern feel that mimics the friendliness of early-learning sans-serifs. **Be Vietnam Pro** is used for body text and labels to ensure maximum legibility and a contemporary, approachable tone.

For educational content, prioritize `body-lg` to ensure text is comfortable for children who are beginning to read. Headlines should always use high-contrast colors (Secondary or Neutral) against light backgrounds to maintain accessibility standards.

## Layout & Spacing

This design system employs a **Fluid Grid** model with generous safe areas. The spacing rhythm is based on an 8px baseline, but defaults to wider gaps (24px+) to prevent the UI from feeling cluttered or overwhelming for younger users.

On mobile devices, a 4-column grid is used with 20px side margins. On tablet and desktop, the system scales to a 12-column grid. Components should rarely "touch" the edges of the screen; instead, they should float within a container of `background-cream` to reinforce the soft, approachable feel.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Ambient Shadows** rather than harsh borders. 

- **Level 0 (Background):** `background-cream`.
- **Level 1 (Cards/Containers):** `surface-white` with a very soft, diffused shadow (10% opacity of the Secondary color, 20px blur, 4px offset).
- **Level 2 (Interactive Elements):** Buttons and active states use the Primary color and may feature a subtle "squishy" inner glow to imply clickability.

Avoid using pure black for shadows; instead, tint shadows with a hint of the secondary midnight blue to keep the palette harmonious and "real."

## Shapes

The shape language is defined by **Rounded** geometry. Sharp corners are entirely avoided to maintain the child-friendly and safe brand promise. Large containers (cards) should utilize `rounded-xl`, while interactive elements like buttons and chips use `rounded-lg`. For icon backgrounds or small badges, use circular (pill-shaped) masks to add variety to the organic layout.

## Components

### Buttons
Primary buttons are high-contrast (Primary Orange background with White text). They should have a minimum height of 56px on mobile to ensure ease of use for small fingers. Secondary buttons use a light tint of the primary color with Primary-colored text.

### Cards
Cards are the primary container for content. They should always have a white background, rounded corners (1rem+), and a soft ambient shadow. Keep padding generous (min 24px) to ensure content breathes.

### Input Fields
Inputs should feel physical and approachable. Use a 2px stroke in a light neutral color, which thickens and changes to the Primary Orange on focus. Labels should be clearly positioned above the field using `label-lg`.

### Chips & Tags
Use chips for filtering or categorization. These should be pill-shaped with a soft background color (e.g., `accent-soft-gold`) and `label-sm` typography.

### Progress Indicators
Given the educational focus, progress bars should be thick (12px height) with fully rounded ends, using the Primary color for progress and a light version of the Secondary color for the track.