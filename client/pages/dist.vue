<template>
  <div class="dist">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="inc" tab="Приход">
        <dist-list
          :items="incomingList"
          :model-value="incoming"
          @update:model-value="inputIncoming"
        />
      </a-tab-pane>
      <a-tab-pane key="dist" tab="Расход">
        <dist-list
          v-model:model-value="cost"
          :items="categoriesWithBalance"
          @update:model-value="inputCost"
        />
      </a-tab-pane>
      <a-tab-pane key="transferring" tab="Перекид">
        <dist-transferring />
      </a-tab-pane>

      <template #leftExtra>
        <div style="min-width: 100px; padding-left: 10px">
          {{ numberWithSpaces(balance) }}
        </div>
      </template>

      <template #rightExtra>
        <a-button
          v-if="activeKey === 'inc'"
          class="mr-4"
          type="primary"
          shape="circle"
          @click="message.warn('Пока не готово')"
        >
          <template #icon><SettingOutlined /></template>
        </a-button>
      </template>
    </a-tabs>

    <template v-if="activeKey !== 'transferring'">
      <a-button @click="save">Save</a-button>
      <a-button @click="resetAll">Reset</a-button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { SettingOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { sum, sumBy } from "lodash";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { useCategoryStore } from "~/store/category";
import { numberWithSpaces, clearObject } from "~/utils";
import { useCategoriesWithBalance } from "~/hooks/useCategoriesWithBalance";
import { useRecordStore } from "~/store/record";

const categoryStore = useCategoryStore();
const recordStore = useRecordStore();
const { incoming: incomingList } = storeToRefs(categoryStore);
const { dist: recordDist, inc: recordInc } = storeToRefs(recordStore);
const { categoriesWithBalance } = useCategoriesWithBalance();

const incoming = reactive<Record<string, number>>({});
const cost = reactive<Record<string, number>>({});

const balance = computed(() => {
  return (
    sum(Object.values(incoming)) +
    sumBy(recordInc.value, "amount") -
    sum(Object.values(cost)) -
    sumBy(recordDist.value, "amount")
  );
});

const activeKey = ref("inc");

const inputIncoming = (e) => (incoming[e.id] = e.value);
const inputCost = (e) => (cost[e.id] = e.value);

const resetAll = () => {
  clearObject(incoming);
  clearObject(cost);
};
const save = async () => {
  if (balance.value <= 0)
    return message.error("Баланс не может быть меньше или равен 0");

  const payload = [
    ...Object.entries(incoming).map(([category, amount]) => ({
      category,
      amount,
      timestamp: dayjs().toISOString(),
      type: "inc",
    })),
    ...Object.entries(cost).map(([category, amount]) => ({
      category,
      amount,
      timestamp: dayjs().toISOString(),
      type: "dist",
    })),
  ];

  if (!payload.length) return;

  await recordStore.addRecords(payload);

  message.success("Записи добавлены");

  resetAll();
};
</script>

<style lang="scss" scoped></style>
