<template>
  <div
    class="bg-background/75 fixed bottom-0 z-30 w-full rounded-t-xl border-t border-gray-200 px-2 pt-2 backdrop-blur dark:border-gray-800"
  >
    <UTabs
      :model-value="activeIndex"
      :default-index="activeIndex"
      :items="links"
      class="bg-background/75 w-full backdrop-blur"
      @change="push"
    >
      <template #default="{ item }">
        <UIcon :name="item.icon" class="h-4 w-4 shrink-0" />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { useVibrate } from '@vueuse/core'
import { useMainLinks } from '~/composables/useMainLinks'

const router = useRouter()

const { links, activeIndex } = useMainLinks()
const { vibrate } = useVibrate({ pattern: [10] })

const push = (index: number) => {
  const to = links.value.find((_, i) => i === index)?.to
  router.push(to)
  vibrate()
}
</script>
