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

      <a-input v-model:value="amount" placeholder="Сумма" type="number" />

      <a-button :disabled="disabled" @click="save">Save</a-button>
  </div>
</template>

<script lang="ts" setup>
import {useCategoriesWithBalance} from '~/hooks/useCategoriesWithBalance'
import {message} from 'ant-design-vue'

const fromValue = ref(null)
const toValue = ref(null)
const amount = ref(null)

const { categoriesWithBalance } = useCategoriesWithBalance()
const options = computed(() => categoriesWithBalance.value.map(({ id, name, balance }) => ({value: id, label: `${name} - ${balance}`})))

const disabled = computed(() => !(fromValue.value && toValue.value && amount.value))

const save = async () => {
    message.warn('Пока не готово')
}
</script>

<style lang="scss" scoped>
.transferring {}
</style>