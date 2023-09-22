import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export function useScreenSize() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const smallerThanLg = breakpoints.smaller('lg')

  return { smallerThanLg, breakpoints }
}
