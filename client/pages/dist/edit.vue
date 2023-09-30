<template>
  <CategoryEdit type="inc" @submit="move" @cancel="move" />
</template>

<script lang="ts" setup>
const router = useRouter()

const move = () => router.push('/dist')
</script>
