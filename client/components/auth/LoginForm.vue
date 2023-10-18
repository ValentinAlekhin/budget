<template>
  <UForm ref="form" :schema="schema" :state="state" @submit.prevent="submit">
    <UFormGroup :label="$t('common.username')" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup :label="$t('common.password')" name="password" class="mt-4">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton class="mt-6" type="submit" block>
      {{ $t('common.login') }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { object, string } from 'yup'
import { useAuthStore } from '~/store/auth'

const schema = object({
  username: string().required('Username required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Password required'),
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

const authStore = useAuthStore()
</script>
