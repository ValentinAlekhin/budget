<template>
  <div>
    <ClientOnly fallback-tag="span">
      <template v-if="isLargeScreen">
        <USelectMenu
          v-model="year"
          :options="yearsOptions"
          style="width: 100px"
        />

        <UTabs :items="items" class="w-full">
          <template #table>
            <stat-tables-costs :records="recordsCostByYear" />
          </template>
          <template #chart>
            <stat-charts-costs :records="recordsCostByYear" />
            <stat-charts-delta
              :cost="recordsCostByYear"
              :inc="recordsIncByYear"
            />
          </template>
        </UTabs>
      </template>

      <span v-else class="center dark:text-white">
        Статистика доступна только с экрана компьютера
      </span>

      <template #fallback>
        <span class="center">Loading</span>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { useRouteQuery } from '@vueuse/router'
import { useStat } from '~/composables/useStat'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')

const { years, cost, inc } = useStat()

const yearsOptions = years.value.map((y) => y.toString())
const year = useRouteQuery('year', dayjs().year().toString())

const recordsCostByYear = computed(() =>
  cost.value.filter((r) => r.year === +year.value)
)

const recordsIncByYear = computed(() =>
  inc.value.filter((r) => r.year === +year.value)
)

const items = [
  {
    label: 'Charts',
    slot: 'chart',
  },
  {
    label: 'Table',
    slot: 'table',
  },
]
</script>

<style lang="scss" scoped>
.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
