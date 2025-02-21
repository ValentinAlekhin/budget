<script lang="ts" setup>
const icon = ref('')
const color = ref('#737373')
const badgeValue = ref('')
const badgeOptions = [{ value: 0, label: 'Name of' }, { value: 1, label: 'Траты' }, { value: 3, label: 'Доходы' }]
</script>

<template>
  <div>
    <h1>UI</h1>
    <UiIconPicker v-model:value="icon" />
    <UiColorPicker v-model:value="color" label="Select color" />
    <UiBadgeSelect v-model:value="badgeValue" :options="badgeOptions" />
  </div>
</template>
