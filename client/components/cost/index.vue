<script setup lang="ts">
const { categoriesWithBalance } = useCategoriesWithBalance()
const {
  categoryStoreRefs: { incoming },
} = useCategoryStore()
const { currentTab, tabs } = useCategoryTabs()

const costFormState = ref<Record<string, { value: string, comment: string }>>(
  {},
)
const incFormState = ref<Record<string, { value: string, comment: string }>>(
  {},
)
</script>

<template>
  <div>
    <CostCards />

    <UTabs v-model="currentTab" :default-value="currentTab" :items="tabs" class="w-full">
      <template #cost>
        <CategoryList
          v-model:value="costFormState"
          type="cost"
          :list="categoriesWithBalance"
        />
      </template>
      <template #inc>
        <CategoryList
          v-model:value="incFormState"
          type="inc"
          :list="incoming"
        />
      </template>
    </UTabs>
  </div>
</template>
