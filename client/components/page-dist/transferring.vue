<template>
  <UForm ref="form" :schema="schema" :state="state" @submit.prevent="save">
    <UFormGroup label="From" name="from" class="mt-2">
      <USelectMenu
        v-model="state.from"
        :options="fromOptions"
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
        :options="toOptions"
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
import dayjs from 'dayjs'
import { number, object, string } from 'yup'
import { useCategoriesWithBalance } from '~/composables/useCategoriesWithBalance'
import { useRecordStore } from '~/store/record'

const recordStore = useRecordStore()
const { categoriesWithBalance } = useCategoriesWithBalance()
const options = computed(() =>
  categoriesWithBalance.value.map(({ id, name, formattedBalance }) => ({
    id,
    label: `${name} ${formattedBalance ? ` (${formattedBalance})` : ''}`,
  }))
)

const schema = object({
  from: string().required(),
  to: string().required(),
  amount: number().positive().required(),
})

const state = ref({
  from: '',
  to: '',
  amount: '',
})

const fromLabel = computed(
  () =>
    options.value.find((c) => c.id === state.value.from)?.label ||
    'Select option'
)

const toLabel = computed(
  () =>
    options.value.find((c) => c.id === state.value.to)?.label || 'Select option'
)

const fromOptions = computed(() =>
  options.value.filter((opt) => opt.id !== state.value.to)
)

const toOptions = computed(() =>
  options.value.filter((opt) => opt.id !== state.value.from)
)

const save = async () => {
  const timestamp = dayjs().toISOString()
  const payload = [
    {
      categoryId: state.value.from,
      amount: -state.value.amount,
      type: 'dist',
      timestamp,
    },
    {
      categoryId: state.value.to,
      amount: +state.value.amount,
      type: 'dist',
      timestamp,
    },
  ]

  await recordStore.addRecords(payload)

  state.value.amount = ''
}
</script>

<style lang="scss" scoped>
.transferring {
}
</style>
