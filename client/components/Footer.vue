<template>
  <a-layout-footer class="footer">
    <a-tabs v-model:activeKey="activeTab" @change="change">
      <a-tab-pane v-for="tab of links" :key="tab.to">
        <template #tab>
          <span>
            <component :is="tab.icon" />
            {{ tab.name }}
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
  </a-layout-footer>
</template>

<script setup lang="ts">
import {
  DatabaseOutlined,
  FundOutlined,
  BankOutlined,
  BranchesOutlined,
} from "@ant-design/icons-vue";

const route = useRoute();
const router = useRouter();

const activeTab = ref("/");

const links = [
  { name: "Cost", icon: BankOutlined, to: "/" },
  { name: "Dist", icon: BranchesOutlined, to: "/dist" },
  { name: "DB", icon: DatabaseOutlined, to: "/db" },
  { name: "Stat", icon: FundOutlined, to: "/stat" },
];

const change = (value: string) => router.push(value);

onMounted(() => (activeTab.value = route.path));
</script>

<style scoped lang="scss">
.footer {
  height: 50px;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}
</style>
