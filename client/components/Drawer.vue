<template>
  <a-button
    class="menu-icon"
    type="primary"
    shape="circle"
    size="large"
    @click="visible = true"
  >
    <template #icon>
      <MenuOutlined />
    </template>
  </a-button>
  <a-drawer v-model:visible="visible" title="Навигация" placement="right">
    <a-menu v-model:selectedKeys="selectedKeys" mode="inline">
      <a-menu-item
        v-for="link of links"
        :key="link.to"
        @click="visible = false"
      >
        <template #icon>
          <component :is="link.icon" />
        </template>
        <nuxt-link :to="link.to">{{ link.name }}</nuxt-link>
      </a-menu-item>
    </a-menu>
  </a-drawer>
</template>
<script lang="ts" setup>
import { MenuOutlined } from "@ant-design/icons-vue";
import { useMainLinks } from "~/hooks/useMainLinks";

const visible = ref<boolean>(false);
const selectedKeys = ref([]);

const { links } = useMainLinks();
</script>

<style lang="scss" scoped>
.menu-icon {
  position: fixed;
  bottom: 10px;
  right: 10px;

  @media screen and (min-width: 1024px) {
    display: none;
  }
}
</style>
