<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar alt="U" />

    <template #account="{ item }">
      <div>
        <span class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </span>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>

    <UModal v-model="isOpen" class="w-80">
      <UCard>
        <template #header>
          <span class="dark:text-white text-lg font-medium"
            >Confirm logout</span
          >
        </template>

        <div class="flex justify-between">
          <UButton color="red" @click="authStore.logout">Logout</UButton>
          <UButton @click="isOpen = false">Cancel</UButton>
        </div>
      </UCard>
    </UModal>
  </UDropdown>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();
const isOpen = ref(false);

const items = [
  [
    {
      label: authStore?.user?.username,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      to: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => (isOpen.value = true),
    },
  ],
];
</script>
