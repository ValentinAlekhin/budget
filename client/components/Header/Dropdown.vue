<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar :alt="usernameFirstLetter" />

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
        class="ms-auto h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
      />
    </template>

    <UModal v-model="isOpen" class="w-80">
      <UCard>
        <template #header>
          <span class="text-lg font-medium dark:text-white"
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
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const isOpen = ref(false)

const usernameFirstLetter = computed(() =>
  user.value?.username[0].toUpperCase()
)

const items = [
  [
    {
      label: user.value?.username,
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      to: '/settings',
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => (isOpen.value = true),
    },
  ],
]
</script>
