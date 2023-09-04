<template>
  <UForm ref="form" :schema="schema" :state="state" @submit.prevent="submit">
    <UFormGroup label="Username" name="username">
      <UInput v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="Email" name="email" class="mt-4">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password" class="mt-4">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton class="mt-6" type="submit" block> Register </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();

const schema = object({
  username: string().required("Username required"),
  email: string().required("Email required").email(),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Password required"),
});

const state = ref({
  username: "",
  password: "",
  email: "",
});

const form = ref();

const submit = async () => {
  await form.value!.validate();
  await authStore.register(state.value);
};
</script>
