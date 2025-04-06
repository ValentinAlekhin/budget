<script setup lang="ts">
interface Props {
  color: string
  icon: string
  name: string
  value: number
}
defineProps<Props>()
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
          :class="`text-${color}-500`"
        />
      </span>
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ name }}
        </span>
        <span class="font-bold text-gray-900 dark:text-white">
          {{ numberWithSpaces(value) }}
        </span>
      </div>
    </div>

    <div class="h-0.5 w-full rounded" :class="`bg-${color}-500`" />
  </UCard>
</template>
