<script lang="ts" setup>
const props = defineProps(['modelValue', 'items'])
const emit = defineEmits(['update:modelValue'])

const getValue = id => props?.modelValue[id]

function setValue(e, id: string) {
  emit('update:modelValue', { id, value: +e.target.value })
}
</script>

<template>
  <div>
    <UInput
      v-for="(inp, i) of props.items"
      :id="inp.id"
      :key="inp.id"
      :model-value="getValue(inp.id)"
      size="md"
      :ui="{ leading: { padding: { md: 'ps-40' } } }"
      class="mb-2"
      type="number"
      @input="setValue($event, inp.id)"
    >
      <template #leading>
        <div
          class="flex w-36 items-center justify-between text-gray-500 dark:text-gray-400"
        >
          <span>{{ inp.name }}</span>
        </div>
      </template>

      <template #trailing>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ i + 1 }}
        </span>
      </template>
    </UInput>
  </div>
</template>
