<template>
  <div
    class="bg-background/75 fixed top-0 z-50 -mb-px w-full border-b border-gray-200 backdrop-blur dark:border-gray-800"
  >
    <header
      class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2"
      v-auto-animate
    >
      <div class="flex items-center">
        <div id="headerTeleport" />
      </div>

      <div v-if="ready || loading" class="inset-center flex items-center">
        <span class="mr-2 text-sm text-slate-300">
          {{ $t('common.updating') }}
        </span>
        <div class="w-8">
          <LoadersPuls v-if="loading" />
          <Icon class="ml-1" v-else name="heroicons:check-20-solid" />
        </div>
      </div>

      <div class="flex w-28 items-center justify-between">
        <header-connection />

        <ThemeSwitch />

        <header-dropdown />
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
const ready = ref(true)
const { loading } = useGlobalLoading()

onMounted(() => {
  if (!loading.value) ready.value = false
})

watch(loading, (value) => {
  if (value) return
  ready.value = true

  const interval = setInterval(() => {
    ready.value = false
    clearInterval(interval)
  }, 2000)
})
</script>

<style lang="scss" scoped>
.inset-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
