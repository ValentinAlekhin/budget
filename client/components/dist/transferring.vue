<template>
  <UForm
      ref="form"
      :schema="schema"
      :state="state"
      @submit.prevent="save"
  >
    <UFormGroup label="From" name="from" class="mt-2">
      <USelectMenu
          v-model="state.from"
          :options="options"
          value-attribute="id"
          size="md"
      >
        <template #label>
          {{ fromLabel }}
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup label="To" name="to" class="mt-2">
      <USelectMenu
          v-model="state.to"
          :options="options"
          value-attribute="id"
          size="md"
      >
        <template #label>
          {{ toLabel }}
        </template>
      </USelectMenu>
    </UFormGroup>

    <UFormGroup label="Amount" name="amount" class="mt-2">
      <UInput v-model="state.amount" type="number" size="md" />
    </UFormGroup>

    <UButton class="mt-8" size="md" type="submit" block> Submit </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import {useCategoriesWithBalance} from '~/hooks/useCategoriesWithBalance'
import {message} from 'ant-design-vue'
import {useRecordStore} from '~/store/record'
import dayjs from 'dayjs'
import {number, object, string} from 'yup'

const recordStore = useRecordStore()
const { categoriesWithBalance } = useCategoriesWithBalance()
const options = computed(() => categoriesWithBalance.value.map(({ id, name, balance }) => ({ id, label: `${name} - ${balance}`})))

const toast = useToast()

const schema = object({
  from: string().required(),
  to: string().required(),
  amount: number().required(),
});

const state = ref({
  from: null,
  to: null,
  amount: number().required(),
});

const fromLabel = computed(
    () => options.value.find((c) => c.id === state.value.from)?.label || "Select option"
);

const toLabel = computed(
    () => options.value.find((c) => c.id === state.value.to)?.label || "Select option"
);

const save = async () => {
    const timestamp = dayjs().toISOString()
    const payload = [
        {
            category: state.value.from,
            amount: -state.value.amount,
            type: 'dist',
            timestamp,
        },
        {
            category: state.value.to,
            amount: +state.value.amount,
            type: 'dist',
            timestamp,
        }
    ]

    await recordStore.addRecords(payload)

    state.value.amount = 0

    toast.add({ title: 'Перевод сохранен' })
}
</script>

<style lang="scss" scoped>
.transferring {}
</style>

