import { formatHex, oklch } from 'culori'

export function numberWithSpaces(x: number) {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export const isSingleDigit = (str: string) => /^\d$/.test(str)

export function clearObject(obj: Record<string, any>): void {
  return Object.keys(obj).forEach(key => delete obj[key])
}

export function median(numbers: number[]): number {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}

export function generatePiniaLocalStorageKey(id: string) {
  return `${id}-pinia-storage`
}

/**
 * Interface representing OKLCH color values
 */
export interface OklchColor {
  l: number // Lightness component (0-1)
  c: number // Chroma component (0-0.4)
  h: number // Hue component (0-360)
}

/**
 * Converts OKLCH color to HEX string
 * @param color - OKLCH color object or individual components
 * @param c - optional chroma component when using individual components
 * @param h - optional hue component when using individual components
 * @returns HEX color string
 */
export function oklchToHex(color: OklchColor): string {
  return formatHex(oklch({ mode: 'oklch', l: color.l, c: color.c, h: color.h }))
}

/**
 * Parses a CSS OKLCH string format and returns its components
 * @param oklchString - OKLCH color string (e.g. "oklch(0.936 0.032 17.717)")
 * @returns OKLCH color object
 */
export function parseOklch(oklchString: string): OklchColor {
  // Extract values from the oklch() format
  const match = oklchString.match(/oklch\(\s*([0-9.%]+)\s+([0-9.%]+)\s+([0-9.%]+)\s*\)/)

  if (!match) {
    throw new Error('Invalid OKLCH string format. Expected: oklch(l c h)')
  }

  // Обработка процентных значений
  const l = match[1].includes('%')
    ? Number.parseFloat(match[1]) / 100
    : Number.parseFloat(match[1])
  const c = Number.parseFloat(match[2])
  const h = Number.parseFloat(match[3])

  return { l, c, h }
}

/**
 * Parses a string in OKLCH format and converts to HEX
 * @param oklchString - OKLCH color string (e.g. "oklch(0.7 0.15 240)")
 * @returns HEX color string
 */
export function parseOklchToHex(oklchString: string): string {
  const { l, c, h } = parseOklch(oklchString)
  return oklchToHex({ l, c, h })
}

/**
 * Converts OKLCH color to CSS color string
 * @param color - OKLCH color object or individual components
 * @param c - optional chroma component when using individual components
 * @param h - optional hue component when using individual components
 * @returns CSS OKLCH color string
 */
export function oklchToString(color: OklchColor | number, c?: number, h?: number): string {
  let l: number, chroma: number, hue: number

  if (typeof color === 'object') {
    l = color.l
    chroma = color.c
    hue = color.h
  }
  else if (typeof color === 'number' && c !== undefined && h !== undefined) {
    l = color
    chroma = c
    hue = h
  }
  else {
    throw new Error('Invalid parameters. Expected OKLCH object or three numbers (l, c, h)')
  }

  return `oklch(${l} ${chroma} ${hue})`
}
