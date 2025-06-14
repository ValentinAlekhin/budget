<script setup lang="ts">
import { get } from 'lodash-es'
import Value from '../Finance/Value.vue'

interface Props {
  color: string
  icon: string
  name: string
  value: number
}
const props = defineProps<Props>()

const iconClasses = {
  red: 'text-red-500',
  green: 'text-green-500',
  yellow: 'text-yellow-500',
}

const splitterClasses = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
}

const iconClass = computed(() => get(iconClasses, props.color || 'red'))
const splitterClass = computed(() => get(splitterClasses, props.color || 'red'))
</script>

<template>
  <UCard>
    <div class="mb-2 flex items-center">
      <span
        class="mr-2 size-8 rounded-full flex items-center justify-center"
        :class="`bg-${color}-300/25`"
      >
        <UIcon
          :name="icon"
          :class="iconClass"
        />
      </span>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ name }}
        </span>
        <Value class="font-bold" :value="value" />
      </div>
    </div>

    <div class="h-0.5 w-full rounded" :class="splitterClass" />
  </UCard>
</template>
