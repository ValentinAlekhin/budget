<template>
  <UTabs :items="tabs" v-model:model-value="currentTab" class="w-full">
    <template #cost>
      <CategoryEdit type="cost" @submit="move" @cancel="move" />
    </template>
    <template #inc>
      <CategoryEdit type="inc" @submit="move" @cancel="move" />
    </template>
  </UTabs>
</template>

<script lang="ts" setup>
import { useCategoryTabs } from '~/composables/useCategoryTabs'
const { currentTab, tabs } = useCategoryTabs()

const router = useRouter()

const move = () => router.push('/')
</script>
