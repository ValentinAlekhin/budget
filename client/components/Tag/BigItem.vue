<script lang="ts" setup>
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'mdi:tag',
  },
  color: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['delete', 'click'])
</script>

<template>
  <UCard class="mb-2" @click="emit('click')">
    <div class="flex justify-between items-center">
      <div class="flex justify-between items-center">
        <UIcon :name="icon" :style="{ color }" size="24" class="mr-2" />
        <span>{{ name }}</span>
      </div>

      <div>
        <UButton
          size="md"
          color="white"
          icon="i-heroicons-trash"
          variant="ghost"
          @click.stop="emit('delete')"
        />
      </div>
    </div>
  </UCard>
</template>
