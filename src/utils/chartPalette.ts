/**
 * Chart color palette aligned with the application's slate/blue theme
 * Provides cohesive colors for data visualization that match the design system
 * 
 * @see docs/THEME.md for complete theme documentation and usage guidelines
 * 
 * IMPORTANT: All charts must also use theme typography:
 * - Use theme.typography.fontFamily for all chart text
 * - Use theme.palette.text.secondary for axis labels
 * - Use theme.palette.divider for grid lines
 */

export const chartPalette = {
  // Regression line - prominent slate blue that stands out
  regressionLine: "#1e293b", // slate-800, matches primary theme
  
  // Subject property point - vibrant green accent that complements the blue theme
  // Distinct enough to stand out while staying within the blue/green color palette
  subjectProperty: "#059669", // emerald-600 - vibrant green accent
  
  // Bed count colors - sequential blue/slate gradient
  // 2 beds: lighter blue
  // 3 beds: medium blue  
  // 4 beds: slate blue
  // 5 beds: darker slate
  bedColors: {
    2: "#60a5fa", // blue-400 - light, airy
    3: "#3b82f6", // blue-500 - matches secondary theme
    4: "#2563eb", // blue-600 - deeper blue
    5: "#1e40af", // blue-800 - deep blue
  },
  
  // Highlighted point color
  highlighted: "#f59e0b", // amber-500 - warm accent for highlights
  
  // Fallback color
  default: "#64748b", // slate-500 - neutral gray
} as const;

/**
 * Get color for a bed count
 */
export function getBedColor(beds: number): string {
  if (beds >= 2 && beds <= 5) {
    return chartPalette.bedColors[beds as keyof typeof chartPalette.bedColors];
  }
  return chartPalette.default;
}

/**
 * Get color for subject property point
 */
export function getSubjectPropertyColor(): string {
  return chartPalette.subjectProperty;
}

/**
 * Get color for regression line
 */
export function getRegressionLineColor(): string {
  return chartPalette.regressionLine;
}

/**
 * Get color for highlighted points
 */
export function getHighlightedColor(): string {
  return chartPalette.highlighted;
}

