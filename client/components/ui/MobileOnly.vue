<template>
  <slot v-if="smallerThanLg" />
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smallerThanLg = breakpoints.smaller('lg')
</script>
