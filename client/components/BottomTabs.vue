<script lang="ts" setup>
const { links } = useMainLinks()
const { vibrate } = useVibrate({ pattern: [10] })

const items = computed(() => links.value.map(l => [l]))
</script>

<template>
  <div
    class="bg-background/75 fixed bottom-0 z-30 flex w-full rounded-t-xl border-t border-gray-200 px-2 backdrop-blur dark:border-gray-800"
  >
    <UNavigationMenu
      :items="items"
      class="w-full border-b border-gray-200 dark:border-gray-800 px-8"
      color="neutral"
      @click="vibrate"
    />
  </div>
</template>
