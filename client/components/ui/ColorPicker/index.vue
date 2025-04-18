<script lang="ts" setup>
import { isPlainObject } from 'lodash-es'
import rawColors from 'tailwindcss/colors'

const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const { value: valueRef } = toRefs(props)

const palettes = Object.entries(rawColors).reduce((acc, [key, value]) => {
  if (COLORS_TO_EXCLUDE.includes(key)) {
    return acc
  }

  if (isPlainObject(value)) {
    const omitted = Object.entries(value).reduce((acc2, [key, value]) => {
      if (key === '50') {
        return acc2
      }

      acc2[key] = oklchToHex(parseOklch(value as string))

      return acc2
    }, {})

    acc.push(omitted)
  }

  return acc
}, [])

const swiperRef = ref(null)
const selectedPalletIndex = ref<null | number>(0)
const selectedPallet = computed(() => palettes[selectedPalletIndex.value])

function selectPalletIndex(i: number) {
  selectedPalletIndex.value = i
  const currentColorExitsInPallet = Object.values(palettes[i]).find(c => c === props.value)
  if (!currentColorExitsInPallet) {
    selectColor(palettes[i][500])
  }
}

function selectColor(color: string) {
  emit('update:value', color)
}

function init(value: string) {
  let index = null

  if (value) {
    palettes.forEach((p, i) => {
      if (Number.isInteger(index)) {
        return
      }

      const find = Object.values(p).find(c => c === value)
      if (find) {
        index = i
      }
    })
  }

  index = Number.isInteger(index) ? index : 0
  selectPalletIndex(index)
}

watch(valueRef, (newValue, oldValue) => {
  if (newValue === oldValue)
    return
  init(newValue)
})

onMounted(() => {
  init(props.value)
})

interface Props {
  value: string
  label: string
}
</script>

<template>
  <div class="w-full">
    <span v-if="label" class="block mb-2 text-xl">{{ label }}</span>

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
          v-for="(pallet, i) of palettes" :key="i" class="size-10"
        >
          <UiColorPickerColor :color="pallet[600]" :active="selectedPalletIndex === i" @click="selectPalletIndex(i)" />
        </swiper-slide>
      </swiper-container>
      <USeparator class="mt-4 mb-4" />

      <swiper-container
        ref="swiperRef"
        free-mode
        :mousewheel="true"
        slides-per-view="auto"
        space-between="8px"
        direction="horizontal"
      >
        <swiper-slide
          v-for="(color) of selectedPallet" :key="color" class="size-10"
        >
          <UiColorPickerColor :color="color" :active="value === color" class="mr-2 mb-2" @click="selectColor(color)" />
        </swiper-slide>
      </swiper-container>
    </ClientOnly>

    <div v-if="value" class="flex justify-center items-center h-8 mt-2">
      <span v-if="value" class="text-sm text-gray-700">{{ value }}</span>
    </div>
  </div>
</template>
