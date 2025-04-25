<script setup lang="ts">
const { tagIds } = defineProps<{
  id: number
  name: string
  color?: string
  icon?: string
  tagIds?: number[]
}>()

defineEmits<{
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}>()

const { tagStore: { getById } } = useTagStore()

const tags = computed(() => tagIds?.map(id => getById(id)))
</script>

<template>
  <UCard class="mb-2 cursor-pointer" @click="$emit('edit', id)">
    <div class="flex justify-between items-center gap-1">
      <div class="flex flex-col max-w-4/5">
        <div class="flex items-center">
          <div v-if="color || icon" class="mr-2 flex w-6 justify-center">
            <UIcon v-if="icon" :style="{ color }" :name="icon" size="24" />

            <span
              v-else-if="color"
              :style="{ background: color }"
              class="inline-block size-2 rounded-full"
            />
          </div>

          <span> {{ name }}</span>
        </div>

        <TagList v-if="tags?.length" :tags="tags" class="mt-1" />
      </div>

      <div>
        <UButton
          size="md"
          color="neutral"
          icon="i-heroicons-trash"
          variant="ghost"
          @click.stop="$emit('delete', id)"
        />

        <UButton
          class="handle"
          color="neutral"
          size="md"
          icon="i-heroicons-arrows-up-down"
          variant="ghost"
          @click.stop
        />
      </div>
    </div>
  </UCard>
</template>
