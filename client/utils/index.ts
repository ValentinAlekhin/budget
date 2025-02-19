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
