<template>
  <div class="flex justify-center items-center h-full flex-col w-full">
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
  layout: "auth",
});

const items = [
  {
    slot: "login",
    label: "Login",
  },
  {
    slot: "reg",
    label: "Register",
  },
];
</script>
