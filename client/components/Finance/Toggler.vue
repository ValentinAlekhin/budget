<script lang="ts" setup>
const { toggle, hidden } = useHiddenFinance()
const icon = computed(() => hidden.value ? 'lucide:eye-off' : 'lucide:eye')
</script>

<template>
  <UButton :icon="icon" color="neutral" variant="link" @click="toggle" />
</template>
