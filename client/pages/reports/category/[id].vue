<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <span>Категория {{ route.params.id }}</span>
</template>
