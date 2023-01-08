<template>
  <div class="footer">
    <ElFooter>
      <ElTabs :model-value="active" tab-position='bottom' @tab-click="handleClick">
        <ElTabPane v-for='tab of links' :key='tab.to' :name='tab.to'>
          <template #label>
            <span class="custom-tabs-label">
              <el-icon class="mr-2 mt-1">
                <component :is="tab.icon"/>
              </el-icon>
              <span>{{ tab.name }}</span>
            </span>
          </template>
        </ElTabPane>
      </ElTabs>
    </ElFooter>
  </div>
</template>

<script setup lang="ts">
import { ElTabs, ElTabPane, ElFooter, ElIcon, TabsPaneContext } from 'element-plus'
import { Calendar, Money, Guide, Coin } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const links = [
  { name: 'Cost', icon: Money, to: '/' },
  { name: 'Dist', icon: Guide, to: '/dist' },
  { name: 'DB', icon: Coin, to: '/db' },
  { name: 'Stat', icon: Calendar, to: '/stat' },
]

const active = computed(() => links.find(({ to }) => route.path.includes(to))?.to)

const handleClick = (tab: TabsPaneContext) => router.push(tab.props.name)
</script>

<style scoped lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  display: flex;
  justify-content: center;
}
</style>