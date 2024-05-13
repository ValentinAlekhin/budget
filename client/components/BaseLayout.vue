<template>
  <div class="h-full overflow-y-auto pb-40 pt-14 lg:pb-0">
    <Header />

    <LoadersSisyphus v-if="!dataExists && loading" />

    <UCard
      v-else-if="error"
      class="fixed left-[50%] top-[50%] w-56 translate-x-[-50%] translate-y-[-50%]"
    >
      <div class="flex flex-col items-center">
        <span class="mb-4 text-center text-rose-400">
          Error loading data from the server
        </span>

        <UButton @click="fetchAll">Reload</UButton>
      </div>
    </UCard>

    <div v-else class="px-2">
      <slot />
    </div>

    <template v-if="smallerThanLg">
      <BottomTabs />
      <Actions />
    </template>
  </div>
</template>

<script setup lang="ts">
const { fetchAll, loading, error, initSocket, dataExists } = useGlobalLoading()
const { smallerThanLg } = useScreenSize()

onMounted(initSocket)
</script>
