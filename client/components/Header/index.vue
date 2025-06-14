<script lang="ts" setup>
const { requestCount } = useApi()
const ready = ref(true)
const loading = ref(false)

let tm: null | NodeJS.Timeout = null
watch(requestCount, () => {
  loading.value = true

  if (tm)
    clearTimeout(tm)
  tm = setTimeout(() => {
    loading.value = false
  }, 400)
})

watch(loading, (value) => {
  if (value)
    return
  ready.value = true

  const interval = setInterval(() => {
    ready.value = false
    clearInterval(interval)
  }, 1200)
})
</script>

<template>
  <div
    class="fixed top-0 z-50 w-full bg-background/75 border-b border-gray-200 backdrop-blur dark:border-gray-800 "
  >
    <header
      class="flex flex-wrap items-center justify-between max-w-screen-sm mx-auto px-1"
    >
      <div class="flex items-center">
        <div id="headerTeleport" />
      </div>

      <div
        v-if="ready || loading"
        v-auto-animate
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
      >
        <div class="w-8">
          <UiLoadersPuls v-if="loading" />
          <UIcon v-else class="ml-1" name="heroicons:check-20-solid" />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <FinanceToggler />
        <UiThemeSwitch />
        <HeaderDropdown />
      </div>
    </header>
  </div>
</template>
