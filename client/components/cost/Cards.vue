<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { InferType } from 'yup'
import { sumBy } from 'lodash-es'

const {
  recordStore,
  recordStoreRefs: { costs, inc, adjustment },
} = useRecordStore()
const { t } = useI18n()
const { filterRecordsByRange } = useRecord()
const { handleClick, currentRange } = useCommonRanges('home-range-index')
const { number, object } = useYap()

const adjustmentModal = ref(false)

const totalIncoming = computed(() => sumBy(inc.value, 'amount'))
const totalCost = computed(() => sumBy(costs.value, 'amount'))
const totalAdjustment = computed(() => sumBy(adjustment.value, 'amount'))

const currentBalance = computed(
  () => totalIncoming.value - totalCost.value + totalAdjustment.value,
)

const costsByRange = computed(() => sumBy(
  filterRecordsByRange(
    costs.value,
    currentRange.value?.start as Dayjs,
    currentRange.value?.end as Dayjs,
  ),
  'amount',
))

const incByRange = computed(() => sumBy(
  filterRecordsByRange(
    inc.value,
    currentRange.value?.start as Dayjs,
    currentRange.value?.end as Dayjs,
  ),
  'amount',
))

const miniCards = computed(() =>
  [
    {
      color: 'red',
      icon: 'bi:arrow-down-right',
      value: costsByRange.value,
      name: t('common.costs'),
    },
    {
      color: 'green',
      icon: 'bi:arrow-up-right',
      value: incByRange.value,
      name: t('common.incoming'),
    },
  ],
)

const schema = object({
  balance: number().positive(),
})
type Schema = InferType<typeof schema>
const state = ref<Schema>({
  balance: 0,
})

function openAdjustmentModal() {
  adjustmentModal.value = true
  state.value = { balance: currentBalance.value }
}

async function submitAdjustment() {
  const diff = state.value.balance - currentBalance.value
  await recordStore.adjustmentBalance(diff)
  adjustmentModal.value = false
}
</script>

<template>
  <UCard class="mb-4">
    <div class="mb-2 flex flex-col">
      <span class="text-sm text-gray-700 dark:text-gray-400">
        {{ $t("common.currentBalance") }}
      </span>
      <div class="flex items-center">
        <span class="text-2xl font-bold">
          {{ numberWithSpaces(currentBalance) }}
        </span>
        <UButton
          icon="i-heroicons-pencil"
          class="ml-2"
          size="xs"
          color="white"
          variant="ghost"
          @click="openAdjustmentModal"
        />
      </div>
    </div>

    <div>
      <span class="mb-1 block text-sm text-gray-700 dark:text-gray-400">
        {{ $t("common.sum") }}
      </span>
      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <span class="mb-0.5 text-xs">
            <Icon
              name="ic:round-arrow-drop-down"
              class="scale-200 text-rose-500"
            />
            {{ $t("common.costs") }}
          </span>
          <span class="font-bold">-{{ numberWithSpaces(totalCost) }}</span>
        </div>

        <div class="flex flex-col">
          <span class="mb-0.5 text-xs">
            <Icon
              name="ic:round-arrow-drop-up"
              class="scale-200 text-green-500"
            />
            {{ $t("common.incoming") }}
          </span>
          <span class="font-bold">+{{ numberWithSpaces(totalIncoming) }}</span>
        </div>
      </div>
    </div>
  </UCard>

  <p class="mb-2 text-sm font-medium text-cyan-500" @click="handleClick">
    {{ currentRange?.name }}
  </p>

  <div class="mb-6 grid grid-cols-2 gap-2">
    <UiStatCard v-for="card of miniCards" :key="card.icon" :icon="card.icon" :color="card.color" :value="card.value" :name="card.name" />

    <UModal v-model="adjustmentModal">
      <UCard>
        <span class="font-semibold">Adjustment of balance</span>

        <UForm
          class="mt-2"
          :schema="schema"
          :state="state"
          @submit="submitAdjustment"
        >
          <UFormGroup label="Balance" name="balance">
            <UInput v-model="state.balance" />
          </UFormGroup>
          <UButton class="mt-4" block type="submit">
            Submit
          </UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>
