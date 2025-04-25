<script lang="ts" setup>
defineProps<{
  tags: TagResponseDto[]
  size?: 'md' | 'xs' | 'sm' | 'lg' | 'xl'
}>()
</script>

<template>
  <ul class="list-none flex items-center flex-wrap">
    <li v-for="tag in tags" :key="tag.id">
      <TagItem :name="tag.name" :color="tag.color" :icon="tag.icon" :size="size" class="mt-1 mr-1" />
    </li>
  </ul>
</template>
