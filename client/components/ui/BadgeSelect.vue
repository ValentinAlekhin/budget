<script lang="ts" setup>
const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const swiperRef = ref(null)

interface Props {
  value: string | number | null | undefined
  options: Array<{ value: number | string, label: string }>
}

function updateValue(value: string | number | null | undefined) {
  emit('update:value', value)
}
</script>

<template>
  <div>
    <ClientOnly>
      <swiper-container
        ref="swiperRef"
        free-mode
        :mousewheel="true"
        slides-per-view="auto"
        space-between="8px"
        direction="horizontal"
      >
        <swiper-slide
          v-for="opt of options" :key="opt.value" class="size-24"
        >
          <UButton :color="opt.value === value ? 'primary' : 'gray'" variant="solid" @click="updateValue(opt.value)">
            {{ opt.label }}
          </UButton>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>
