<template>
  <UDropdown :items="items">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
    />
  </UDropdown>
</template>

<script lang="ts" setup>
const props = defineProps<{ record: any }>();
const emit = defineEmits(["edit", "delete"]);
const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => emit("edit", props.record),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => emit("delete", props.record),
    },
  ],
];
</script>
