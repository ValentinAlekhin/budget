<template>
  <a-layout class="layout" :class="{ loading, error, auth: !user }">
    <a-spin v-if="loading" size="large" />

    <div v-else-if="error" class="error">
      <a-typography-text class="mb-4" type="danger">
        Ошибка загрузки данных с сервера
      </a-typography-text>

      <a-button type="primary" @click="fetchAll">Перезагрузить</a-button>
    </div>

    <template v-else>
      <Header v-if="user" />

      <a-layout-content class="content">
        <NuxtPage />
      </a-layout-content>

      <Drawer v-if="user" />
    </template>
  </a-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useGlobalLoading } from "~/hooks/useGlobalLoading";
import { useMainLinks } from "~/hooks/useMainLinks";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { fetchAll, loading, error, initSocket } = useGlobalLoading();

onMounted(() => initSocket());
</script>
yarn add -D @unocss/nuxt
<style lang="scss" scoped>
.layout {
  padding-bottom: 50px;
  &.loading,
  &.error,
  &.auth {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
  }

  .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content {
    height: 100%;
  }
}
</style>

<style lang="scss">
html,
body,
#__nuxt,
.ant-layout {
  //height: 100%;
}

body {
  padding-bottom: 100px;
}
</style>
