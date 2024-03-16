<template>
  <UCard class="mb-4">
    <div class="mb-4 flex flex-col">
      <span class="text-sm text-gray-700 dark:text-gray-400">
        {{ $t('common.currentBalance') }}
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
        {{ $t('common.sum') }}
      </span>
      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <span class="mb-0.5 text-xs">
            <Icon
              name="ic:round-arrow-drop-down"
              class="scale-200 text-rose-500"
            />
            {{ $t('common.costs') }}
          </span>
          <span class="font-bold">-{{ numberWithSpaces(totalCost) }}</span>
        </div>

        <div class="flex flex-col">
          <span class="mb-0.5 text-xs">
            <Icon
              name="ic:round-arrow-drop-up"
              class="scale-200 text-green-500"
            />
            {{ $t('common.incoming') }}
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
    <UCard v-for="card of miniCards" :key="card.icon">
      <div class="mb-4 flex items-center">
        <span
          class="mr-2 h-8 w-8 rounded-full"
          :class="`bg-${card.color}-300/25`"
        >
          <Icon
            :name="card.icon"
            class="ml-[8px] mt-[5px]"
            :class="`text-${card.color}-500`"
          />
        </span>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ card.name }}
          </span>
          <span class="font-bold text-gray-900 dark:text-white">
            {{ numberWithSpaces(card.value) }}
          </span>
        </div>
      </div>

      <div class="h-0.5 w-full rounded" :class="`bg-${card.color}-500`" />
    </UCard>

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
          <UButton class="mt-4" block type="submit"> Submit </UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { sumBy } from 'lodash-es'
import { Dayjs } from 'dayjs'
import { useRecord } from '~/composables/useRecord'
import { useRecordStore } from '~/store/record'
import { useCommonRanges } from '~/composables/useCommonRanges'
import { useYap } from '~/composables/useYap'
import type { InferType } from 'yup'

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

const miniCards = computed(() =>
  [
    {
      color: 'red',
      icon: 'bi:arrow-down-right',
      categories: costs,
      name: t('common.costs'),
    },
    {
      color: 'green',
      icon: 'bi:arrow-up-right',
      categories: inc,
      name: t('common.incoming'),
    },
  ].map((item) => ({
    ...item,
    value: sumBy(
      filterRecordsByRange(
        item.categories.value,
        currentRange.value?.start as Dayjs,
        currentRange.value?.end as Dayjs,
      ),
      'amount',
    ),
  })),
)

const schema = object({
  balance: number().positive(),
})
type Schema = InferType<typeof schema>
const state = ref<Schema>({
  balance: 0,
})

const openAdjustmentModal = () => {
  adjustmentModal.value = true
  state.value = { balance: currentBalance.value }
}

const submitAdjustment = async () => {
  const diff = state.value.balance - currentBalance.value
  await recordStore.adjustmentBalance(diff)
  adjustmentModal.value = false
}
</script>
