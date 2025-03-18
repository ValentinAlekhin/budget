<script lang="ts" setup>
const {
  socketStoreRef: { connected },
} = useSocketStore()
const { isOnline } = useNetwork()
</script>

<template>
  <UPopover>
    <UButton variant="link" class="relative">
      <span
        class="absolute left-[25.5px] top-[11.5px] block size-1 rounded"
        :class="isOnline ? 'bg-green-600' : 'bg-red-600'"
      />
      <span
        class="absolute left-[25.5px] top-[19.5px] block size-1 rounded"
        :class="connected ? 'bg-green-600' : 'bg-red-600'"
      />

      <Icon
        name="heroicons-outline:server"
        size="24"
        class="text-slate-500 dark:text-white"
      />
    </UButton>

    <template #content>
      <UCard>
        <div class="flex flex-col items-center">
          <UBadge
            :color="isOnline ? 'success' : 'error'"
            :label="$t('common.network')"
            class="mb-2"
          />
          <UBadge
            :color="connected ? 'success' : 'error'"
            :label="$t('common.server')"
          />
        </div>
      </UCard>
    </template>
  </UPopover>
</template>
