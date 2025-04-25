<script setup lang="ts">
const { categoriesWithBalance } = useCategoriesWithBalance()
const {
  categoryStoreRefs: { incoming },
} = useCategoryStore()
const { currentTab, tabs } = useCategoryTabs()

interface FormState {
  value: string
  comment: string
  tagId: number
}

const costFormState = ref<Record<string, FormState>>(
  {},
)
const incFormState = ref<Record<string, FormState>>(
  {},
)
</script>

<template>
  <div>
    <CostCards />

    <UTabs v-model="currentTab" :default-value="currentTab" :items="tabs" color="neutral" class="w-full">
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
