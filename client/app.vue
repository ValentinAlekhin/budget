<script lang="ts" setup>
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()

const color = computed(() => (colorMode.value === 'dark' ? '#030712' : '#fff'))
</script>

<template>
  <UApp class="h-screen overflow-y-auto dark:bg-gray-950">
    <VitePwaManifest />

    <Head>
      <Meta name="theme-color" :content="color" />
    </Head>

    <NuxtLayout name="mobile">
      <NuxtPage />
    </NuxtLayout>

    <span
      class="i-heroicons-cog-6-tooth i-heroicons-banknotes i-heroicons-inbox-arrow-down i-heroicons-circle-stack i-heroicons-presentation-chart-line i-heroicons-plus hidden bg-cyan-300 bg-green-300 bg-green-300/25 bg-red-300 bg-red-400 bg-green-400 bg-red-300/25 text-rose-300"
    />
  </UApp>
</template>
