<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])
const { colorsList } = useTailwindColors()
</script>

<template>
  <UPopover class="inline-block">
    <div class="flex items-center">
      <span class="mr-2">{{ $t("common.color") }}</span>

      <span
        class="block h-5 w-10 rounded border-2 border-gray-500"
        :style="{ background: props.modelValue }"
      />
    </div>

    <template #panel>
      <ul class="grid h-60 grid-cols-11 gap-1 overflow-auto p-4">
        <li
          v-for="color of colorsList"
          :key="color.hex"
          :style="{ background: color.hex }"
          class="size-6 rounded border-0 p-0 outline-0"
          @click="emit('update:modelValue', color.hex)"
        />
      </ul>
    </template>
  </UPopover>
</template>
