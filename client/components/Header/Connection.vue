<script lang="ts" setup>
const {
  socketStoreRef: { connected },
} = useSocketStore()
const { isOnline } = useNetwork()
</script>

<template>
  <UPopover>
    <span class="relative">
      <span
        class="absolute left-[15px] top-[8px] block size-1 rounded"
        :class="isOnline ? 'bg-green-600' : 'bg-red-600'"
      />
      <span
        class="absolute left-[15px] top-[16px] block size-1 rounded"
        :class="connected ? 'bg-green-600' : 'bg-red-600'"
      />

      <Icon
        name="heroicons-outline:server"
        size="24"
        class="text-slate-500 dark:text-white"
      />
    </span>

    <template #panel>
      <UCard>
        <div class="flex flex-col items-center">
          <UBadge
            :color="isOnline ? 'green' : 'red'"
            :label="$t('common.network')"
            class="mb-2"
          />
          <UBadge
            :color="connected ? 'green' : 'red'"
            :label="$t('common.server')"
          />
        </div>
      </UCard>
    </template>
  </UPopover>
</template>
