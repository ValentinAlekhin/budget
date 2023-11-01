<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="submit">
    <UFormGroup :label="$t('common.username')" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup :label="$t('common.email')" name="email" class="mt-4">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup :label="$t('common.password')" name="password" class="mt-4">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton class="mt-6" type="submit" block>
      {{ $t('common.register') }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'
import { useBackendValidators } from '~/composables/useBackendValidators'

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

const submit = async () => {
  await form.value!.validate()
  await authStore.register(state.value)
}
</script>
