export function useTheme() {
  const colorMode = useColorMode()
  const { colors } = useTailwindColors()

  const isLight = computed(() => colorMode.value === 'light')
  const isDark = computed(() => !isLight.value)

  const backgroundColor = computed(() =>
    isLight.value ? colors.white : colors.gray['950'],
  )

  const toggleTheme = () =>
    (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')

  return { isDark, isLight, backgroundColor, toggleTheme }
}
