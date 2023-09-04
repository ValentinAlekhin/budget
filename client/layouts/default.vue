<template>
  <div class="pt-14 pb-20">
    <a-spin v-if="loading" size="large" />

    <UCard v-else-if="error" class="flex flex-col justify-center">
      <template #header>
        <span class="text-rose-400"> Error loading data from the server </span>
      </template>

      <div class="flex justify-center">
        <UButton @click="fetchAll">Reload</UButton>
      </div>
    </UCard>

    <template v-else>
      <Header />

      <div class="px-2">
        <slot />
      </div>

      <BottomTabs />
      <UiActions />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGlobalLoading } from "~/hooks/useGlobalLoading";

const { fetchAll, loading, error, initSocket } = useGlobalLoading();

onMounted(() => initSocket());
</script>
