<template>
  <div>
    <page-dist-list
      :items="incomingList"
      :model-value="incoming"
      @update:model-value="inputIncoming"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'
import { useActionsStore } from '~/store/actions'

const categoryStore = useCategoryStore()
const recordStore = useRecordStore()
const actionsStore = useActionsStore()

const { incoming: incomingList } = storeToRefs(categoryStore)

const incoming = reactive<Record<string, number>>({})
const hasValue = computed(() => !!Object.values(incoming).find((v) => v))

const inputIncoming = (e) => (incoming[e.id] = e.value)

const resetAll = () => {
  clearObject(incoming)
}

const save = async () => {
  const payload = Object.entries(incoming).map(([categoryId, amount]) => ({
    categoryId,
    amount,
    timestamp: dayjs().toISOString(),
    type: 'inc',
  }))

  if (!payload.length) return

  await recordStore.addRecords(payload)

  resetAll()
}

watch(hasValue, (value) => {
  if (value) {
    actionsStore.setActions({
      cancel: resetAll,
      submit: save,
    })
  } else actionsStore.$reset()
})
</script>
