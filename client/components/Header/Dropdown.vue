<template>
  <UDropdown
    v-model:open="isDropDownOpen"
    :items="items"
    :popper="{ placement: 'bottom-start' }"
  >
    <button @touchstart.stop.prevent="isDropDownOpen = !isDropDownOpen">
      <UAvatar :alt="usernameFirstLetter" />
    </button>

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
        class="ms-auto size-4 shrink-0 text-gray-400 dark:text-gray-500"
      />
    </template>
  </UDropdown>

  <UModal v-model="isExitModalOpen" class="w-80">
    <UCard>
      <template #header>
        <span class="text-lg font-medium dark:text-white">
          {{ $t('common.confirmLogout') }}
        </span>
      </template>

      <div class="flex justify-between">
        <UButton color="red" @click="authStore.logout">
          {{ $t('common.logout') }}
        </UButton>
        <UButton @click="isExitModalOpen = false">
          {{ $t('common.cancel') }}
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()
const isDropDownOpen = ref(false)
const isExitModalOpen = ref(false)

const usernameFirstLetter = computed(() =>
  user.value?.username[0].toUpperCase(),
)

const items = computed(() => [
  [
    {
      label: user.value?.username,
      slot: 'account',
      disabled: true,
    },
  ],
  [
    {
      label: t('common.settings'),
      icon: 'i-heroicons-cog-8-tooth',
      to: '/settings',
    },
  ],
  [
    {
      label: t('common.logout'),
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => (isExitModalOpen.value = true),
    },
  ],
])
</script>
