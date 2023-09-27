<template>
  <div>
    <UTabs v-model:activeKey="activeKey" :items="tabs">
      <template #incoming>
        <page-dist-list
          :items="incomingList"
          :model-value="incoming"
          @update:model-value="inputIncoming"
        />
      </template>

      <template #transferring>
        <page-dist-transferring />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'
import { useActionsStore } from '~/store/actions'

const categoryStore = useCategoryStore()
const recordStore = useRecordStore()
const actionsStore = useActionsStore()

const { incoming: incomingList } = storeToRefs(categoryStore)

const tabs = [
  {
    slot: 'incoming',
    label: 'Incoming',
  },
  {
    slot: 'transferring',
    label: 'Transferring',
  },
]

const incoming = reactive<Record<string, number>>({})
const hasValue = computed(() => !!Object.values(incoming).find((v) => v))
const activeKey = ref('inc')

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
