<script lang="ts" setup>
import { isPlainObject } from 'lodash-es'
import rawColors from 'tailwindcss/colors'

const props = defineProps<Props>()

const emit = defineEmits(['update:value'])

const palettes = Object.entries(rawColors).reduce((acc, [_, value]) => {
  if (isPlainObject(value)) {
    acc.push(value)
  }
  return acc
}, [])

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

onMounted(() => {
  if (props.value) {
    let index = null
    palettes.forEach((p, i) => {
      if (Number.isInteger(index)) {
        return
      }

      const find = Object.values(p).find(c => c === props.value)
      if (find) {
        index = i
      }
    })

    selectPalletIndex(index)
  }
  else {
    selectPalletIndex(0)
  }
})

interface Props {
  value: string
  label: string
}
</script>

<template>
  <div class="w-full p-4">
    <span v-if="label" class="block mb-2 text-xl">{{ label }}</span>

    <div class="flex flex-wrap">
      <div v-for="(pallet, i) of palettes" :key="i">
        <UiColorPickerColor :color="pallet[600]" :active="selectedPalletIndex === i" class="mr-2 mb-2" @click="selectPalletIndex(i)" />
      </div>
    </div>

    <UDivider class="mt-2 mb-4" />

    <div v-if="Number.isInteger(selectedPalletIndex)" class="flex flex-wrap mb-2">
      <div v-for="(color) of selectedPallet" :key="color">
        <UiColorPickerColor :color="color" :active="value === color" class="mr-2 mb-2" @click="selectColor(color)" />
      </div>
    </div>

    <div v-if="value" class="text-center">
      <span class="text-sm text-gray-700">{{ value }}</span>
    </div>
  </div>
</template>
