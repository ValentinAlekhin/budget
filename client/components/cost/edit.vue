<template>
  <div>
    <UTabs :items="tabs" v-model:model-value="currentTab" class="w-full">
      <template #cost>
        <CategoryEdit type="cost" @submit="move" @cancel="move" />
      </template>
      <template #inc>
        <CategoryEdit type="inc" @submit="move" @cancel="move" />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { useCategoryTabs } from '~/composables/useCategoryTabs'
import { usePlan } from '~/composables/usePlan'

const { currentTab, tabs } = useCategoryTabs()

const router = useRouter()

const move = () => router.push('/')
</script>
