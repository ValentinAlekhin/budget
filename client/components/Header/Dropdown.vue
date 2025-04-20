<script lang="ts" setup>
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()
const isExitModalOpen = ref(false)

const usernameFirstLetter = computed(() =>
  user.value?.username[0].toUpperCase(),
)

async function logout() {
  await authStore.logout()
  isExitModalOpen.value = false
}

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
      onSelect: () => (isExitModalOpen.value = true),
    },
  ],
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton variant="link">
      <UAvatar :alt="usernameFirstLetter" />
    </UButton>
  </UDropdownMenu>

  <UModal v-model:open="isExitModalOpen" class="w-80">
    <template #content>
      <UCard>
        <template #header>
          <span class="text-lg font-medium dark:text-white">
            {{ $t("common.confirmLogout") }}
          </span>
        </template>

        <div class="flex justify-between">
          <UButton color="error" @click="logout">
            {{ $t("common.logout") }}
          </UButton>
          <UButton @click="isExitModalOpen = false">
            {{ $t("common.cancel") }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
