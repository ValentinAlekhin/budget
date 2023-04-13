<template>
  <a-layout>
    <Header v-if="authStore.user" />

    <a-layout-content :class="{ full: !authStore.user }">
      <NuxtPage />
    </a-layout-content>

    <Footer v-if="authStore.user" />
  </a-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import { useCategoryStore } from "~/store/category";
import { useRecordStore } from "~/store/record";
import { useSocketStore } from "~/store/socket";

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const recordStore = useRecordStore();
const socketStore = useSocketStore();

onMounted(async () => {
  if (!authStore.user) return;

  await Promise.all([
    socketStore.init(),
    categoryStore.fetchAll(),
    recordStore.init(),
  ]);
});
</script>

<style lang="scss" scoped>
.full {
  height: 100vh;
}
</style>
