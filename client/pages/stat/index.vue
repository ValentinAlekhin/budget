<template>
  <div class="stat">
    <ClientOnly fallback-tag="span">
      <template v-if="isLargeScreen">
        <a-select
          v-model:value="year"
          :options="yearsOptions"
          style="width: 100px"
        />

        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="table" tab="Таблицы">
            <stat-tables-costs :records="recordsCostByYear" />
          </a-tab-pane>
          <a-tab-pane key="chart" tab="Графики">
            <stat-charts-costs :records="recordsCostByYear" />
            <stat-charts-delta
              :cost="recordsCostByYear"
              :inc="recordsIncByYear"
            />
          </a-tab-pane>
        </a-tabs>
      </template>

      <span v-else class="center">
        Статистика доступна только с экрана компьютера
      </span>

      <template #fallback>
        <a-spin class="center" size="large" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useRouteQuery } from "@vueuse/router";
import { ref } from "vue";
import { useStat } from "~/hooks/useStat";

const isLargeScreen = useMediaQuery("(min-width: 1024px)");

const { years, cost, inc } = useStat();

const yearsOptions = computed(() =>
  years.value.map((year) => ({ label: year, value: year }))
);

const year = useRouteQuery("year", dayjs().year().toString(), {
  transform: Number,
});

const recordsCostByYear = computed(() =>
  cost.value.filter((r) => r.year === year.value)
);

const recordsIncByYear = computed(() =>
  inc.value.filter((r) => r.year === year.value)
);

const activeKey = ref("table");
</script>

<style lang="scss" scoped>
.center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
