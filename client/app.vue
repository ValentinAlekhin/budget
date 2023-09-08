<template>
  <div class="h-screen dark:bg-gray-950 overflow-y-auto">
    <Head>
      <Meta name="theme-color" :content="color" />
    </Head>

    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />

    <span
      class="bg-red-300 bg-cyan-300 bg-green-300 hidden i-heroicons-cog-6-tooth i-heroicons-banknotes i-heroicons-inbox-arrow-down i-heroicons-circle-stack i-heroicons-presentation-chart-line i-heroicons-plus text-rose-300"
    />
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const colorMode = useColorMode();
const route = useRoute();

const color = computed(() => (colorMode.value === "dark" ? "#030712" : "#fff"));

const breakpoints = useBreakpoints(breakpointsTailwind);

const smallerThanLg = breakpoints.smaller("lg");
const layout = computed(() => {
  if (route.path.includes("auth")) return "auth";

  return smallerThanLg.value ? "mobile" : "desktop";
});
</script>
