<script lang="ts" setup>
const { links } = useMainLinks()
const { vibrate } = useVibrate({ pattern: [10] })

const navUi = {
  container: 'justify-around w-full',
}
</script>

<template>
  <div
    class="bg-background/75 fixed bottom-0 z-30 flex w-full rounded-t-xl border-t border-gray-200 px-2 backdrop-blur dark:border-gray-800"
  >
    <UHorizontalNavigation
      :links="links"
      class="border-b border-gray-200 dark:border-gray-800"
      :ui="navUi"
      @click="vibrate"
    />
  </div>
</template>
