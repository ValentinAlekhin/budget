<template>
  <UPopover class="inline-block">
    <div class="flex items-center">
      <span class="mr-2">Select a color</span>

      <span
        class="block h-5 w-10 rounded"
        :style="{ background: props.modelValue }"
      />
    </div>

    <template #panel>
      <ul class="grid h-60 grid-cols-11 gap-1 overflow-auto p-4">
        <li
          v-for="color of colorsList"
          :key="color.hex"
          :style="{ background: color.hex }"
          class="h-6 w-6 rounded border-0 p-0 outline-0"
          @click="emit('update:modelValue', color.hex)"
        />
      </ul>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { useTailwindColors } from '#imports'

const { colorsList } = useTailwindColors()
const open = ref(false)

console.log(colorsList)

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])
</script>
