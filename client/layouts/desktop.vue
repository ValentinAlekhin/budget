<template>
  <BaseLayout>
    <ul class="grid gap-2 cardList">
      <UCard
        v-for="component of components"
        :key="component"
        class="h-full overflow-y-auto hover:ring-cyan-500 dark:hover:ring-cyan-800 ease-in-out duration-200 scrollbar-none"
      >
        <Component :is="component" />
      </UCard>
    </ul>
  </BaseLayout>
</template>

<script lang="ts" setup>
const components = ["cost", "dist", "db", "stat"].map((name) =>
  resolveComponent(name)
);
</script>

<style lang="scss" scoped>
.cardList {
  grid-template-columns: 400px 400px 800px minmax(1300px, 1fr);
  height: calc(100vh - 64px);
}
</style>
