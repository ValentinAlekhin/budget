<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <ui-theme-switch />

    <UCard class="mt-8 w-80">
      <UTabs :items="items" class="w-full">
        <template #login><auth-login-form /></template>
        <template #reg><auth-register-form /></template>
      </UTabs>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const items = [
  {
    slot: 'login',
    label: 'Login',
  },
  {
    slot: 'reg',
    label: 'Register',
  },
]
</script>
