<template>
  <BaseLayout>
    <ul class="cardList grid gap-2">
      <UCard
        v-for="component of components"
        :key="component"
        class="h-full overflow-y-auto duration-200 ease-in-out scrollbar-none hover:ring-cyan-500 dark:hover:ring-cyan-800"
      >
        <Component :is="component" />
      </UCard>
    </ul>
  </BaseLayout>
</template>

<script lang="ts" setup>
const components = ['cost', 'dist', 'db', 'stat'].map((name) =>
  resolveComponent(name)
)
</script>

<style lang="scss" scoped>
.cardList {
  grid-template-columns: 400px 400px 800px minmax(1300px, 1fr);
  height: calc(100vh - 64px);
}
</style>
