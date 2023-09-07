<template>
  <div class="h-screen dark:bg-gray-950 overflow-y-auto">
    <Head>
      <Meta name="theme-color" :content="color" />
    </Head>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />

    <span
      class="hidden i-heroicons-cog-6-tooth i-heroicons-banknotes i-heroicons-inbox-arrow-down i-heroicons-circle-stack i-heroicons-presentation-chart-line i-heroicons-plus text-rose-300"
    />
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode();

const color = computed(() => (colorMode.value === "dark" ? "#030712" : "#fff"));
</script>
