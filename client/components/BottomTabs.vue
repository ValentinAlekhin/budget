<template>
  <div
    class="pt-2 px-2 w-full fixed bottom-0 rounded-t-xl border-t bg-background/75 backdrop-blur border-gray-200 dark:border-gray-800 z-30"
  >
    <UTabs
      :model-value="activeIndex"
      :default-index="activeIndex"
      :items="links"
      class="w-full bg-background/75 backdrop-blur"
      @change="push"
    >
      <template #default="{ item }">
        <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { useVibrate } from "@vueuse/core";
import { useMainLinks } from "~/hooks/useMainLinks";

const router = useRouter();

const { links, activeIndex } = useMainLinks();
const { vibrate } = useVibrate({ pattern: [10] });

const push = (index: number) => {
  const to = links.value.find((_, i) => i === index)?.to;
  router.push(to);
  vibrate();
};
</script>
