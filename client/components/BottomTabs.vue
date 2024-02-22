<template>
  <div
    class="fixed bottom-0 z-30 w-full rounded-t-xl border-t border-gray-200 px-6 backdrop-blur dark:border-gray-800"
  >
    <UHorizontalNavigation
      :links="horizontalNavigationLinks"
      class="border-b border-gray-200 dark:border-gray-800"
      @click="vibrate"
    />
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

const { horizontalNavigationLinks } = useMainLinks()
const { vibrate } = useVibrate({ pattern: [10] })
</script>
