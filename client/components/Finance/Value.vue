<script lang="ts" setup>
defineProps<Props>()

const { hidden } = useHiddenFinance()

interface Props {
  value: number
}
</script>

<template>
  <span :class="{ 'blur-sm': hidden }" class="transition-all duration-500 ease-in-out">
    {{ numberWithSpaces(value) }}
  </span>
</template>

<style lang="scss">

</style>
