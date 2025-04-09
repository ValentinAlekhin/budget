<script lang="ts" setup>
const { object, string } = useYap()

const authStore = useAuthStore()
const { usernameSchema, emailSchema } = useBackendValidators()

const schema = object({
  username: usernameSchema,
  email: emailSchema,
  password: string().min(8).required(),
})

const state = ref({
  username: '',
  password: '',
  email: '',
})

const form = ref()

async function submit() {
  await form.value!.validate()
  await authStore.register(state.value)
}
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="submit">
    <UFormField :label="$t('common.username')" name="username">
      <UInput v-model="state.username" class="w-full" />
    </UFormField>

    <UFormField :label="$t('common.email')" name="email" class="mt-4">
      <UInput v-model="state.email" class="w-full" />
    </UFormField>

    <UFormField :label="$t('common.password')" name="password" class="mt-4">
      <UInput v-model="state.password" type="password" class="w-full" />
    </UFormField>

    <UButton class="mt-6" type="submit" block>
      {{ $t("common.register") }}
    </UButton>
  </UForm>
</template>
