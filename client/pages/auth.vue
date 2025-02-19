<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

const items = computed(() => [
  {
    slot: 'login',
    label: t('common.login'),
  },
  {
    slot: 'reg',
    label: t('common.register'),
  },
])
</script>

<template>
  <div class="flex size-full flex-col items-center justify-center">
    <UiThemeSwitch />

    <UCard class="mt-8 w-80">
      <UTabs :items="items" class="w-full">
        <template #login>
          <auth-login-form />
        </template>
        <template #reg>
          <auth-register-form />
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
