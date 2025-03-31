<script setup lang="ts">
const mode = useColorMode()
const { state, next } = useCycleList(['dark', 'light', 'auto'] as const, { initialValue: mode.value })

const colorIconMap = {
  dark: 'i-heroicons-moon-20-solid',
  light: 'i-heroicons-sun-20-solid',
  auto: 'i-lucide-laptop-minimal',
}

const icon = computed(() => colorIconMap[state.value]) as string

watch(state, (v) => {
  mode.value = v
})
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="icon"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="next()"
    />

    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
