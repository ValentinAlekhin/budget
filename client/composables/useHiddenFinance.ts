import { useLocalStorage } from '@vueuse/core'

export const useHiddenFinance = createSharedComposable(() => {
  const hidden = useLocalStorage(
    'hidden-finance',
    false,
  )

  const toggle = () => {
    hidden.value = !hidden.value
  }

  return {
    hidden,
    toggle,
  }
})
