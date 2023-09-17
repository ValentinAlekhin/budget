<template>
  <div>
    <ClientOnly>
      <Teleport to="#headerTeleport">
        <span v-if="balance" class="mr-4 font-semibold text-base" @click="copyBalance">
          {{
            numberWithSpaces(balance)
          }}
        </span>
      </Teleport>
    </ClientOnly>

    <UTabs v-model:activeKey="activeKey" :items="tabs">
      <template #incoming>
        <dist-list
            :items="incomingList"
            :model-value="incoming"
            @update:model-value="inputIncoming"
        />
      </template>

      <template #distribution>
        <dist-list
            v-model="cost"
            :items="categoriesWithBalance"
            @update:model-value="inputCost"
        />
      </template>

      <template #transferring>
        <dist-transferring />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { useCategoryStore } from "~/store/category";
import { useCategoriesWithBalance } from "~/composables/useCategoriesWithBalance";
import { useRecordStore } from "~/store/record";
import { useNotify } from "~/composables/useNotify";
import { useActionsStore } from "~/store/actions";
import {useClipboard} from '@vueuse/core'
import {sum, sumBy} from 'lodash-es'

const categoryStore = useCategoryStore();
const recordStore = useRecordStore();
const notify = useNotify();
const actionsStore = useActionsStore();

const { incoming: incomingList } = storeToRefs(categoryStore);
const { dist: recordDist, inc: recordInc } = storeToRefs(recordStore);
const { categoriesWithBalance } = useCategoriesWithBalance();

const tabs = [
  {
    slot: "incoming",
    label: "Incoming",
  },
  {
    slot: "distribution",
    label: "Distribution",
  },
  {
    slot: "transferring",
    label: "Transferring",
  },
];

const incoming = reactive<Record<string, number>>({});
const cost = reactive<Record<string, number>>({});

const hasValue = computed(() => {
  const incomingHas = !!Object.values(incoming).find((v) => v);
  const costHas = !!Object.values(cost).find((v) => v);

  return incomingHas || costHas;
});

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
  if (balance.value < 0) return notify.error("Баланс не может быть меньше 0");

  const payload = [
    ...Object.entries(incoming).map(([categoryId, amount]) => ({
      categoryId,
      amount,
      timestamp: dayjs().toISOString(),
      type: "inc",
    })),
    ...Object.entries(cost).map(([categoryId, amount]) => ({
      categoryId,
      amount,
      timestamp: dayjs().toISOString(),
      type: "dist",
    })),
  ];

  if (!payload.length) return;

  await recordStore.addRecords(payload);

  resetAll();
};

const copyBalance = async () => {
  const { copy } = useClipboard({ source: balance })
  await copy()
  notify.success('Copied')
}

watch(hasValue, (value) => {
  if (value) {
    actionsStore.setActions({
      cancel: resetAll,
      submit: save,
    });
  } else actionsStore.$reset();
});
</script>

