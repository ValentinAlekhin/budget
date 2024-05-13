import { isPlainObject } from 'lodash-es'
import colors from 'tailwindcss/colors'

export function useTailwindColors() {
  const colorsList = Object.entries(colors).reduce((acc, [name, shades]) => {
    if (!isPlainObject(shades)) {
      return acc
    }

    Object.entries(shades).forEach(([shade, hex]) =>
      acc.push({
        name,
        shade,
        hex,
      }),
    )

    return acc
  }, [] as any[])

  return { colorsList, colors }
}
