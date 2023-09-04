<template>
  <div>
      <UInput v-for="(inp, i) of props.items"
        :id="inp.id"
        :value="getValue(inp.id)"
        size="md"
        :ui="{ leading: { padding: { md: 'ps-40' } } }"
        class="mb-2"
        type="number"
        @input="setValue($event, inp.id)"
      >
        <template #leading>
          <div
              class="text-gray-500 dark:text-gray-400 flex justify-between items-center w-36"
          >
            <span>{{ inp.name }}</span>
            <span>{{ inp.balance }}</span>
          </div>
        </template>

        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">
            {{ i + 1 }}
          </span>
        </template>
      </UInput>
  </div>
</template>


<script lang="ts" setup>
const props = defineProps(['modelValue', 'items'])

const emit = defineEmits(['update:modelValue'])

const getValue = (id) => props?.modelValue[id]

const setValue = (e, id: string) => {
    emit('update:modelValue', { id, value:  +e.target.value  })
}

</script>
