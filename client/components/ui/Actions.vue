<template>
  <TransitionGroup
    class="fixed flex flex-col right-4 bottom-16"
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
      :ui="{ rounded: 'rounded-full' }"
      @click="btn.click"
    />
  </TransitionGroup>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useActionsStore } from "~/store/actions";

const actionsStore = useActionsStore();
const actionsRef = storeToRefs(actionsStore);

const buttons = computed(() =>
  [
    {
      icon: "plus",
      color: "primary",
      click: actionsRef.add?.value,
    },
    {
      icon: "cog-6-tooth",
      color: "primary",
      class: "mb-2",
      click: actionsRef.edit?.value,
    },
    {
      icon: "check-20-solid",
      color: "green",
      class: "mb-2 mt-4",
      click: actionsRef.submit?.value,
    },
    {
      icon: "x-mark-20-solid",
      color: "rose",
      click: actionsRef.cancel?.value,
    },
  ]
    .filter((btn) => btn.click)
    .map((btn) => ({
      ...btn,
      class: btn?.class || "",
      icon: `i-heroicons-${btn.icon}`,
    }))
);
</script>

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