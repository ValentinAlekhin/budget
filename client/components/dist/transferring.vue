<template>
  <div class="transferring">
      <a-select
              ref="select"
              v-model:value="fromValue"
              style="width: 100%"
              :options="options"
      />

      <a-select
              ref="select"
              v-model:value="toValue"
              style="width: 100%"

              :options="options"
      />

      <a-input v-model:value.number="amount" placeholder="Сумма" type="number" />

      <a-button :disabled="disabled" @click="save">Save</a-button>
  </div>
</template>

<script lang="ts" setup>
import {useCategoriesWithBalance} from '~/hooks/useCategoriesWithBalance'
import {message} from 'ant-design-vue'
import {useRecordStore} from '~/store/record'
import dayjs from 'dayjs'

const fromValue = ref<string>('')
const toValue = ref<string>('')
const amount = ref<number>(0)

const recordStore = useRecordStore()
const { categoriesWithBalance } = useCategoriesWithBalance()
const options = computed(() => categoriesWithBalance.value.map(({ id, name, balance }) => ({value: id, label: `${name} - ${balance}`})))

const disabled = computed(() => !(fromValue.value && toValue.value && amount.value))

const save = async () => {
    const timestamp = dayjs().toISOString()
    const payload = [
        {
            category: fromValue.value,
            amount: -amount.value,
            type: 'dist',
            timestamp,
        },
        {
            category: toValue.value,
            amount: amount.value,
            type: 'dist',
            timestamp,
        }
    ]

    await recordStore.addRecords(payload)

    amount.value = 0

    message.success('Перевод сохранен')
}
</script>

<style lang="scss" scoped>
.transferring {}
</style>

