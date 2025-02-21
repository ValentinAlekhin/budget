<script lang="ts" setup>
const icon = ref('')
const color = ref('#737373')
</script>

<template>
  <div>
    <h1>UI</h1>
    <UiIconPicker v-model:value="icon" />
    <UiColorPicker v-model:value="color" label="Select color" />
  </div>
</template>
