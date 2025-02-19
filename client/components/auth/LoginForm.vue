<script lang="ts" setup>
const authStore = useAuthStore()
const { object, string } = useYap()

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
    <UFormGroup :label="$t('common.username')" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup :label="$t('common.password')" name="password" class="mt-4">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton class="mt-6" type="submit" block>
      {{ $t("common.login") }}
    </UButton>
  </UForm>
</template>
