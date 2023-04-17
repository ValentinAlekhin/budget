<template>
  <div class="auth">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="login" tab="Логин"><auth-login-form /></a-tab-pane>
      <a-tab-pane key="register" tab="Регистрация"
        ><auth-register-form
      /></a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeKey = ref("login");
</script>

<style lang="scss" scoped>
.auth {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
