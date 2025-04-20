<script lang="ts" setup>
const { links } = useMainLinks()

const items = computed(() => links.value.map(l => [l]))
</script>

<template>
  <div
    class="bg-background/75 fixed bottom-0 z-30 w-full rounded-t-xl border-t border-gray-200 px-2 backdrop-blur dark:border-gray-800 flex items-center justify-center"
  >
    <UNavigationMenu
      :items="items"
      class="w-full max-w-screen-sm border-b border-gray-200 dark:border-gray-800 px-8"
      color="neutral"
    />
  </div>
</template>
