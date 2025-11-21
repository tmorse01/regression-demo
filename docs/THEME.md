# Theme Documentation

This document describes the design system and theme configuration for the Construction Lender Regression Analysis application.

## Overview

The application uses a modern slate/blue color scheme with a clean, professional aesthetic. The theme is built on Material-UI (MUI) and follows a consistent design language throughout all components.

## Color Palette

### Primary Colors

The primary color palette uses slate blue-gray tones:

- **Primary Main**: `#1e293b` (slate-800)

  - Used for: Primary actions, headers, important UI elements
  - Light variant: `#475569` (slate-600)
  - Dark variant: `#0f172a` (slate-900)

- **Secondary Main**: `#3b82f6` (blue-500)
  - Used for: Accent elements, secondary actions, highlights
  - Light variant: `#60a5fa` (blue-400)
  - Dark variant: `#2563eb` (blue-600)

### Background Colors

- **Default Background**: `#f8fafc` (slate-50)
  - Main application background
- **Paper Background**: `#ffffff` (white)

  - Cards, panels, elevated surfaces

- **Sidebar Background** (Light Mode): `#e2e8f0` (slate-200)
- **Sidebar Background** (Dark Mode): `#1e293b` (slate-800)

- **Workspace Background** (Light Mode): `#f1f5f9` (slate-100)
- **Workspace Background** (Dark Mode): `#0f172a` (slate-900)

### Semantic Colors

The theme uses MUI's default semantic colors for:

- **Error**: Red tones (for errors, warnings)
- **Warning**: Amber/orange tones (for warnings, highlights)
- **Info**: Blue tones (for informational elements)
- **Success**: Green tones (for success states)

## Typography

### Font Family

The application uses **Poppins** as the primary font family, loaded from Google Fonts, with a system font stack as fallback:

```typescript
fontFamily: [
  '"Poppins"',
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
].join(",");
```

Poppins is loaded with weights: 300, 400, 500, 600, 700 to support all typography variants.

### Typography Variants

The theme includes comprehensive typography variant configurations:

- **h1**: 2.5rem, weight 700, line-height 1.2, letter-spacing -0.02em
- **h2**: 2rem, weight 700, line-height 1.3, letter-spacing -0.02em
- **h3**: 1.75rem, weight 600, line-height 1.3, letter-spacing -0.01em
- **h4**: 1.5rem, weight 600, line-height 1.4
- **h5**: 1.25rem, weight 600, line-height 1.4, letter-spacing -0.02em
- **h6**: 1.125rem, weight 600, line-height 1.5
- **body1**: 1rem, line-height 1.5
- **body2**: 0.875rem, line-height 1.5
- **button**: weight 500, no text transform

### Typography Guidelines

- **Headings**: Use MUI Typography variants (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`)
- **Body Text**: Use `body1` or `body2` variants
- **Captions**: Use `caption` variant for small text
- **Font Weights**:
  - Regular: 400
  - Medium: 500
  - Semi-bold: 600
  - Bold: 700

### Typography Usage in Charts

All charts must use the theme's typography font family:

```typescript
const axisStyle = {
  stroke: theme.palette.text.secondary,
  fontSize: 12,
  fontFamily: theme.typography.fontFamily,
};
```

## Chart Color Palette

The chart palette (`src/utils/chartPalette.ts`) provides theme-aligned colors for data visualization:

### Regression Line

- **Color**: `#1e293b` (slate-800)
- **Usage**: Linear regression lines on scatter plots
- **Rationale**: Matches primary theme color for consistency

### Subject Property Point

- **Color**: `#059669` (emerald-600)
- **Usage**: Marking the subject property on charts
- **Rationale**: Vibrant green accent that complements the blue theme while remaining distinct

### Bed Count Colors (Sequential Gradient)

A sequential blue gradient for categorizing properties by bedroom count:

- **2 Beds**: `#60a5fa` (blue-400) - Light, airy
- **3 Beds**: `#3b82f6` (blue-500) - Matches secondary theme
- **4 Beds**: `#2563eb` (blue-600) - Deeper blue
- **5 Beds**: `#1e40af` (blue-800) - Deep blue

### Highlighted Points

- **Color**: `#f59e0b` (amber-500)
- **Usage**: Hover states, selected points
- **Rationale**: Warm accent that stands out against cool blue tones

### Fallback Color

- **Color**: `#64748b` (slate-500)
- **Usage**: Default color for edge cases

## Component Overrides

### AppBar

The AppBar uses a gradient background:

```typescript
background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
```

With subtle shadow:

```typescript
boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
```

### Chart Cards

Chart cards use a glassmorphic design:

- **Background**: `rgba(255, 255, 255, 0.95)` with `backdropFilter: blur(10px)`
- **Border**: `1px solid rgba(0, 0, 0, 0.05)`
- **Border Radius**: `3` (24px)
- **Shadow**: Subtle elevation shadow
- **Hover Effect**: `translateY(-2px)` with enhanced shadow

## Spacing & Layout

### Spacing Scale

The theme uses MUI's default 8px spacing scale:

- Small: `1` (8px)
- Medium: `2` (16px)
- Large: `3` (24px)
- Extra Large: `4` (32px)

### Border Radius

- **Small**: `1` (8px) - Buttons, inputs
- **Medium**: `2` (16px) - Cards, panels
- **Large**: `3` (24px) - Chart cards, major containers

## Usage Guidelines

### When to Use Theme Colors

1. **Primary (`theme.palette.primary.main`)**:

   - Primary buttons
   - Navigation elements
   - Important headings
   - Regression lines

2. **Secondary (`theme.palette.secondary.main`)**:

   - Secondary buttons
   - Accent elements
   - 3-bedroom properties (in charts)

3. **Chart Palette**:
   - Always use `chartPalette` utilities for chart colors
   - Never hardcode chart colors
   - Use semantic functions: `getBedColor()`, `getRegressionLineColor()`, etc.

### Typography Best Practices

1. **Always use theme typography**:

   ```typescript
   fontFamily: theme.typography.fontFamily;
   ```

2. **Use semantic color tokens**:

   ```typescript
   color: theme.palette.text.primary;
   color: theme.palette.text.secondary;
   ```

3. **Maintain consistent font sizes**:
   - Chart axes: `12px`
   - Body text: Default MUI sizes
   - Headings: Use Typography variants

### Chart Styling

1. **Axis Styling**: Always use `axisStyle` pattern:

   ```typescript
   const axisStyle = {
     stroke: theme.palette.text.secondary,
     fontSize: 12,
     fontFamily: theme.typography.fontFamily,
   };
   ```

2. **Grid Styling**: Use consistent grid style:

   ```typescript
   const gridStyle = {
     stroke: theme.palette.divider,
     strokeDasharray: "3 3",
     strokeOpacity: 0.5,
   };
   ```

3. **Tooltip Styling**: Use theme-aware tooltips:
   ```typescript
   backgroundColor: theme.palette.background.paper;
   border: `1px solid ${theme.palette.divider}`;
   ```

## Dark Mode Support

The application supports both light and dark modes. When implementing new components:

1. Use theme-aware colors: `theme.palette.background.default`
2. Avoid hardcoded colors
3. Test in both light and dark modes
4. Use semantic color tokens (`text.primary`, `text.secondary`, `divider`)

## Accessibility

- **Color Contrast**: All text meets WCAG AA standards
- **Focus States**: Visible focus indicators on interactive elements
- **Typography**: Readable font sizes and line heights

## Theme File Location

- **Main Theme**: `src/main.tsx`
- **Chart Palette**: `src/utils/chartPalette.ts`

## Examples

### Using Chart Palette

```typescript
import { getBedColor, getRegressionLineColor } from '../utils/chartPalette';

// In chart component
<Line
  stroke={getRegressionLineColor()}
  // ...
/>

<Scatter fill={getBedColor(listing.beds)} />
```

### Using Theme Typography

```typescript
const theme = useTheme();

const axisStyle = {
  stroke: theme.palette.text.secondary,
  fontSize: 12,
  fontFamily: theme.typography.fontFamily,
};
```

### Using Theme Colors

```typescript
sx={{
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}}
```

## Maintenance

When updating the theme:

1. Update this documentation
2. Update `src/main.tsx` theme configuration
3. Update `src/utils/chartPalette.ts` if chart colors change
4. Test all components in both light and dark modes
5. Verify accessibility standards are maintained
