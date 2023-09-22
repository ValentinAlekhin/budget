export const numberWithSpaces = (x: number) => {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export const isSingleDigit = (str: string) => /^\d$/.test(str)

export function doGetCaretPosition(oField: HTMLInputElement): number {
  // Initialize
  let iCaretPos = 0

  // IE Support
  if (document.selection) {
    // Set focus on the element
    oField.focus()

    // To get cursor position, get empty selection range
    const oSel = document.selection.createRange()

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length)

    // The caret position is selection length
    iCaretPos = oSel.text.length
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart === '0')
    iCaretPos =
      oField.selectionDirection === 'backward'
        ? oField.selectionStart
        : oField.selectionEnd

  // Return results
  return iCaretPos
}

export function setCaretPosition(elem, positions: number) {
  if (elem != null) {
    elem.setSelectionRange(positions, positions)
    elem.focus()
  }
}

export const clearObject = (obj: Record<string, any>): void =>
  Object.keys(obj).forEach((key) => delete obj[key])

export const median = (numbers: number[]): number => {
  const sorted = Array.from(numbers).sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }

  return sorted[middle]
}
