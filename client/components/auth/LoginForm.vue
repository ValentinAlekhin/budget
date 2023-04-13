<template>
  <a-form :model="formState" @finish="onFinish">
    <a-form-item
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input
        v-model:value="formState.username"
        placeholder="Имя пользователя"
        type="email"
      />
    </a-form-item>

    <a-form-item
      name="password"
      :rules="[{ required: true, message: 'Please input your pass!' }]"
    >
      <a-input
        v-model:value="formState.password"
        placeholder="Пароль"
        type="password"
      />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">Войти</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();

interface FormStateI {
  username: string;
  password: string;
}

const formState = reactive<FormStateI>({
  username: "",
  password: "",
});

const onFinish = (values: FormStateI) => {
  authStore.login(values);
};
</script>
