<template>
  <a-layout-header class="header">
    <span class="title">Бюджет</span>
    <a-avatar size="large" @click="showExitConfirm">{{
      authStore.user.username[0]
    }}</a-avatar>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { Modal } from "ant-design-vue";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-svg";
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();

const showExitConfirm = () =>
  Modal.confirm({
    title: "Выйти из учетной записи?",
    icon: createVNode(ExclamationCircleOutlined),
    okText: "Выйти",
    cancelText: "Отмена",
    async onOk() {
      await authStore.logout();
    },
  });
</script>

<style lang="scss" scoped>
.header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 20px;
  color: #fff;
}
</style>
