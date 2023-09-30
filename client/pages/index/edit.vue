<template>
  <CategoryEdit type="cost" @submit="move" @cancel="move" />
</template>

<script lang="ts" setup>
const router = useRouter()

const move = () => router.push('/')
</script>
