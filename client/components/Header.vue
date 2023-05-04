<template>
  <a-layout-header class="header">
    <span class="title">Бюджет</span>
    <a-menu v-model:selectedKeys="selectedKeys" class="menu" mode="horizontal">
      <a-menu-item v-for="link of links" :key="link.to">
        <template #icon>
          <component :is="link.icon" />
        </template>
        <nuxt-link :to="link.to">{{ link.name }}</nuxt-link>
      </a-menu-item>
    </a-menu>
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
import { useMainLinks } from "~/hooks/useMainLinks";

const authStore = useAuthStore();

const { links } = useMainLinks();

const selectedKeys = ref([]);

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

.menu {
  display: none;

  @media screen and (min-width: 1024px) {
    display: block;
  }
}
</style>
