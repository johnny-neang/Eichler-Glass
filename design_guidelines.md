# Eichler Glass Design Guidelines

## Design System: Midcentury Editorial with Aqua Blue Accent

### Design Principles
1. **Editorial first**: Typography and imagery lead the visual hierarchy
2. **Midcentury restraint**: Paired with coastal-modern Aqua Blue
3. **Few colors, large planes**: Confident use of whitespace
4. **Hierarchy through scale**: Asymmetry and strategic color use
5. **Aqua Blue dominance**: Primary interactive accent throughout

---

## Color Palette

### Neutral Foundation
- **White**: #FFFFFF (backgrounds, text on dark)
- **Paper**: #F4F4F2 (primary background)
- **Fog**: #E9E9E6 (subtle backgrounds)
- **Ink**: #0B0B0D (primary text)
- **Ink Soft**: #2A2A2E (secondary text)
- **Muted**: #6F737A (tertiary text, captions)
- **Stroke**: #D9D9D6 (borders, dividers)

### Midcentury Accents
- **Cobalt**: #345EA8 (complementary accent, use sparingly)
- **Sunflower**: #E0D400 (minimal accent, less than Aqua)
- **Cream**: #F6F1E3 (warm backgrounds)

### Aqua Blue (Primary Accent)
- **Primary**: #5FB3B3 (CTAs, active states, links, focus)
- **Soft**: #DFF1F1 (caption panels, callouts, highlights)
- **Deep**: #3C8F8F (hover states, emphasis)

### Color Usage Rules
- Aqua Blue is the **primary accent** for all interactions and emphasis
- Primary CTAs: Aqua Primary (#5FB3B3) background with white text
- Hover states: Aqua Deep (#3C8F8F)
- Active navigation and focus states: Aqua Primary
- Highlight panels and callouts: Aqua Soft (#DFF1F1) backgrounds
- Aqua should visually outweigh sunflower and complement cobalt

---

## Typography

### Editorial Hierarchy
- **Display headings**: Large, bold, confident scale with ample whitespace
- **Body text**: Clean, readable with generous line-height
- **Captions**: Ink Soft or Muted for secondary information
- Use typographic scale and whitespace to create hierarchy rather than color

---

## Layout System

### Spacing
- Use Tailwind spacing units: **4, 8, 16, 24, 32** (p-4, p-8, py-16, etc.)
- **Large planes**: Generous padding and margins
- **Confident whitespace**: Don't fear empty space
- Section padding: py-16 mobile, py-24 desktop

### Grid & Structure
- Clean, editorial-style layouts
- Asymmetric compositions where appropriate
- Content-first approach with imagery supporting the narrative

---

## Components

### CTA Buttons
**Primary Variant**:
- Background: #5FB3B3 (Aqua Primary)
- Text: #FFFFFF (White)
- Hover Background: #3C8F8F (Aqua Deep)
- Border Radius: Full pill shape (rounded-full)
- Padding: Generous (px-6 py-3 minimum)

**Secondary Variant**:
- Background: Transparent
- Text: #5FB3B3 (Aqua Primary)
- Border: 1px solid #5FB3B3
- Border Radius: Full pill shape (rounded-full)

### Caption Panels & Callouts
- Background: #DFF1F1 (Aqua Soft)
- Text Color: #0B0B0D (Ink)
- Border Radius: Medium (rounded-md)
- Padding: 16px (p-4)
- Use for pricing details, booking confirmations, important info

### Navigation
- Active Link Color: #5FB3B3 (Aqua Primary)
- Active Underline: 2px solid #5FB3B3
- Focus Ring: 2px solid #5FB3B3
- Clean, minimal navbar with clear hierarchy

### Cards & Containers
- Subtle borders using Stroke (#D9D9D6)
- Background alternates between White, Paper, and Fog
- Border radius: Medium (rounded-md to rounded-lg)

---

## Motion & Animation

### Easing
- Primary easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (snappy, editorial feel)

### Durations
- **Fast**: 140ms (micro-interactions)
- **Base**: 220ms (standard transitions)
- **Slow**: 320ms (page transitions, complex animations)

### Usage
- Minimal, purposeful animations
- Smooth transitions on hover states
- Focus on editorial restraint

---

## Images

### Hero Sections
- **Large, impactful photography** showcasing Bay Area homes with glass features
- Full-width or asymmetric placement
- High-quality images of Eichler homes, modern glass installations
- Images should feel editorial and aspirational

### Service Pages
- Before/after photos of glass cleaning
- Interior/exterior transformations
- Skylight installations
- Real project photography from Castro Valley, Concord, Walnut Creek areas

### Image Placement
- Hero: Full-width background or large asymmetric placement
- Service tiers: Photography supporting each package level
- City pages: Local landmarks or representative homes
- Customer portal: Clean, icon-driven (minimal photography)

---

## Page-Specific Guidelines

### City Landing Pages
- Hero with city-specific imagery and Aqua CTA
- Service tier comparison with Aqua Soft highlights
- Local testimonials or social proof
- Clear booking path with Aqua Primary buttons

### Booking Flow
- Clean, editorial form design
- Aqua Soft panels for pricing confirmation
- Cal.com embed with Aqua accent coordination
- $50 deposit messaging in caption panels

### Customer Portal
- Dashboard cards with clean borders
- Appointment cards with status indicators using Aqua
- Payment history with Aqua accents for active items
- Minimal, functional design

### Admin Dashboard
- Pipeline view with status color coding (Aqua for active)
- Clean data tables with Stroke borders
- Opportunity detail cards with Aqua Soft highlights
- Action buttons using Aqua Primary

---

## Key Differentiators

1. **Editorial confidence**: Large type, ample whitespace, imagery leads
2. **Aqua Blue identity**: Consistent use as primary interactive color
3. **Midcentury restraint**: Limited palette, purposeful color use
4. **Local focus**: City-specific imagery and content
5. **Professional service aesthetic**: Clean, trustworthy, modern