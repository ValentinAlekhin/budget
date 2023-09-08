<template>
  <div class="pt-14 pb-40 lg:pb-2 h-full overflow-y-auto">
    <Header />

    <UiLoader v-if="loading" />

    <UCard
      v-else-if="error"
      class="w-56 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div class="flex flex-col items-center">
        <span class="text-rose-400 text-center mb-4">
          Error loading data from the server
        </span>

        <UButton @click="fetchAll">Reload</UButton>
      </div>
    </UCard>

    <div v-else class="px-2">
      <slot />
    </div>

    <template v-if="smallerThanLg">
      <BottomTabs />
      <UiActions />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGlobalLoading } from "~/hooks/useGlobalLoading";
import { useScreenSize } from "~/hooks/useScreenSize";

const { fetchAll, loading, error, initSocket } = useGlobalLoading();

const { smallerThanLg } = useScreenSize();

onMounted(() => initSocket());
</script>
