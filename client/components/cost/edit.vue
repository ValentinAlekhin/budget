<template>
  <div>
    <UTabs :items="tabs" v-model:model-value="currentTab" class="w-full">
      <template #cost>
        <CategoryEdit
          type="cost"
          :tab="currentTabName"
          @submit="move"
          @cancel="move"
        />
      </template>
      <template #inc>
        <CategoryEdit
          type="inc"
          :tab="currentTabName"
          @submit="move"
          @cancel="move"
        />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { useCategoryTabs } from '~/composables/useCategoryTabs'
import { usePlan } from '~/composables/usePlan'

const { currentTab, tabs, currentTabName } = useCategoryTabs()

const router = useRouter()

const move = () => router.push('/')
</script>
