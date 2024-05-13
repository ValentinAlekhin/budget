<template>
  <div>
    <CostCards />

    <UTabs :items="tabs" v-model:model-value="currentTab" class="w-full">
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

<script setup lang="ts">
import { useCategoryStore } from '~/store/category'

const router = useRouter()
const { categoriesWithBalance } = useCategoriesWithBalance()
const {
  categoryStoreRefs: { incoming },
} = useCategoryStore()
const { currentTab, tabs } = useCategoryTabs()

const costFormState = ref<Record<string, { value: string; comment: string }>>(
  {},
)
const incFormState = ref<Record<string, { value: string; comment: string }>>({})
</script>
