export const SCALE_BASE = 375
export const FONT_SIZE_BASE = 24
export const STROKE_WIDTH_BASE = 4
export const ERASER_WIDTH_BASE = 10 * STROKE_WIDTH_BASE

export function fontSize(scale) {
  return FONT_SIZE_BASE * scale.scale / SCALE_BASE
}

export function strokeWidth(scale) {
  return STROKE_WIDTH_BASE * scale.scale / SCALE_BASE
}

export function eraserWidth(scale) {
  return ERASER_WIDTH_BASE * scale.scale / SCALE_BASE
}

/* Rounds a number to the nearest even number.
 * Bounds with min and max, if provided */
export function round2(value, min, max) {
  let result = 2 * Math.round(value / 2)

  if (result < min) return min
  if (result > max) return max

  return result
}



// WEBPACK FOOTER //
// ./app/util/sizing.js