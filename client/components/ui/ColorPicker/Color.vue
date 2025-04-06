<script lang="ts" setup>
interface Props {
  color: string
  active: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['click'])

function isDarkColor(hexColor: string) {
  hexColor = hexColor.replace(/^#/, '')

  const r = Number.parseInt(hexColor.substring(0, 2), 16) / 255
  const g = Number.parseInt(hexColor.substring(2, 4), 16) / 255
  const b = Number.parseInt(hexColor.substring(4, 6), 16) / 255

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance < 0.5
}

const className = computed(() => {
  const name = isDarkColor(props.color) ? 'white' : 'black'

  return `text-${name}`
})
</script>

<template>
  <span class="flex justify-center items-center size-10 rounded-md cursor-pointer" :style="{ background: color }" @click="emit('click')">
    <transition name="fade">
      <UIcon v-if="active" name="material-symbols:check-rounded" class="size-8" :class="className" />
    </transition>
  </span>
</template>
