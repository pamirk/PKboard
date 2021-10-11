import { functionKeySymbol } from '../util/system'

export const TEXT = 'text'
export const PENCIL = 'pencil'
export const LINE = 'line'
export const ERASER = 'eraser'
export const IMAGE = 'image'
export const UNDO = 'undo'

export const SHORTCUTS = {
  84: TEXT,
  80: PENCIL,
  68: PENCIL,
  76: LINE,
  69: ERASER,
}

export const SHORTCUTS_REVERSE = {
  [TEXT]: 'T',
  [PENCIL]: 'P',
  [LINE]: 'L',
  [ERASER]: 'E',
  [UNDO]: `${functionKeySymbol()}Z`
}



// WEBPACK FOOTER //
// ./app/lib/tool-names.js