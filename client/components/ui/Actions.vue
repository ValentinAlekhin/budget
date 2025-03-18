<script lang="ts" setup>
import { useVibrate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

const actionsStore = useActionsStore()
const actionsRef = storeToRefs(actionsStore)
const { vibrate } = useVibrate({ pattern: [10] })

const buttons = computed(() =>
  [
    {
      icon: 'plus',
      color: 'primary',
      click: actionsRef.add?.value,
    },
    {
      icon: 'cog-6-tooth',
      color: 'primary',
      class: 'mb-2',
      click: actionsRef.edit?.value,
    },
    {
      icon: 'check-20-solid',
      color: 'success',
      class: 'mb-2 mt-4',
      click: actionsRef.submit?.value,
    },
    {
      icon: 'x-mark-20-solid',
      color: 'error',
      click: actionsRef.cancel?.value,
    },
  ]
    .filter(btn => btn.click)
    .map(btn => ({
      ...btn,
      class: btn.class || '',
      icon: `i-heroicons-${btn.icon}`,
      click: () => {
        btn.click()
        vibrate()
      },
    })),
)
</script>

<template>
  <TransitionGroup
    class="fixed bottom-16 right-4 flex flex-col"
    name="list"
    tag="div"
  >
    <UButton
      v-for="btn of buttons"
      :key="btn.icon"
      :icon="btn.icon"
      size="xl"
      :color="btn.color"
      square
      variant="solid"
      :class="btn.class"
      class="rounded-xl"
      @click="btn.click"
    />
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
