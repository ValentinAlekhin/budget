<template>
  <div class="h-screen overflow-y-auto dark:bg-gray-950">
    <VitePwaManifest />

    <Head>
      <Meta name="theme-color" :content="color" />
    </Head>

    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />

    <span
      class="i-heroicons-cog-6-tooth i-heroicons-banknotes i-heroicons-inbox-arrow-down i-heroicons-circle-stack i-heroicons-presentation-chart-line i-heroicons-plus hidden bg-cyan-300 bg-green-300 bg-green-300/25 bg-red-300 bg-red-300/25 text-rose-300"
    />
  </div>
</template>

<script lang="ts" setup>
import { useScreenSize } from '~/composables/useScreenSize'
const colorMode = useColorMode()
const route = useRoute()

const color = computed(() => (colorMode.value === 'dark' ? '#030712' : '#fff'))

const { smallerThanLg } = useScreenSize()

const layout = computed(() => {
  if (route.path.includes('auth')) return 'auth'

  return smallerThanLg.value ? 'mobile' : 'desktop'
})
</script>

<style></style>
