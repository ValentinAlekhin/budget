<template>
  <NuxtPage/>
</template>

<script setup lang='ts'>
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ID_INJECTION_KEY } from 'element-plus'

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})
</script>