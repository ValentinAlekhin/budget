<script lang="ts" setup>
defineProps<{
  name: string
  icon: string
  color: string
  size?: 'md' | 'xs' | 'sm' | 'lg' | 'xl'
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()
</script>

<template>
  <UBadge
    :color="active ? 'primary' : 'neutral'"
    :variant="active ? 'subtle' : 'outline'"
    :size="size"
    @click="emit('click', $event)"
  >
    <template #leading>
      <UIcon :name="icon" :style="{ color }" :size="size" />
    </template>
    {{ name }}
  </UBadge>
</template>
