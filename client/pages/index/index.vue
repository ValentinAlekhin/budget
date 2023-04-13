<template></template>

<script setup lang="ts">
import { useCategoryStore } from "~/store/category";

const categoryStore = useCategoryStore();

onMounted(() => {
  console.log(categoryStore.costs);
});
</script>
