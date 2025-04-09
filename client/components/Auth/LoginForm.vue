<script lang="ts" setup>
const authStore = useAuthStore()
const { object, string } = useYap()
const { t } = useI18n()

const schema = object({
  username: string().required(),
  password: string().min(8).required(),
})

const state = ref({
  username: '',
  password: '',
})

const form = ref()

async function submit() {
  await form.value!.validate()
  await authStore.login(state.value)
}
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="submit">
    <UFormField :label="t('common.username')" name="username">
      <UInput v-model="state.username" class="w-full" />
    </UFormField>

    <UFormField :label="t('common.password')" name="password" class="mt-4">
      <UInput v-model="state.password" type="password" class="w-full" />
    </UFormField>

    <UButton class="mt-6" type="submit" block>
      {{ t("common.login") }}
    </UButton>
  </UForm>
</template>
