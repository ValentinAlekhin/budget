<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="toggleTheme"
    />

    <template #fallback>
      <div class="h-8 w-8" />
    </template>
  </ClientOnly>
</template>

<script setup>
const { toggleTheme, isDark } = useTheme()
</script>
