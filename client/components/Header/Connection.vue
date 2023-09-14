<template>
  <UPopover>
    <span class="relative">
      <span
        class="absolute rounded block w-1 h-1 top-[8px] left-[15px]"
        :class="isOnline ? 'bg-green-600' : 'bg-red-600'"
      />
      <span
        class="absolute rounded block w-1 h-1 top-[16px] left-[15px]"
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
            label="Network"
            class="mb-2"
          />
          <UBadge :color="connected ? 'green' : 'red'" label="Server" />
        </div>
      </UCard>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useNetwork } from "@vueuse/core";
import { useSocketStore } from "~/store/socket";

const socketStore = useSocketStore();
const { connected } = storeToRefs(socketStore);
const { isOnline } = useNetwork();
</script>
