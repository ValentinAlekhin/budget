<template>
  <BaseLayout>
    <ul class="grid gap-2 h-full cardList hover:border-cyan-500">
      <UCard
        v-for="component of components"
        :key="component"
        class="h-full overflow-y-auto hover:ring-cyan-500 dark:hover:ring-cyan-800 ease-in-out duration-200"
      >
        <Component :is="component" />
      </UCard>
    </ul>
  </BaseLayout>
</template>

<script lang="ts" setup>
const components = ["cost", "dist", "db"].map((name) => resolveComponent(name));
</script>

<style lang="scss" scoped>
.cardList {
  grid-template-columns: 350px 350px 800px;
}
</style>
