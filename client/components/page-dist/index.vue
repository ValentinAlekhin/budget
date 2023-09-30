<template>
  <div>
    <page-dist-list
      v-if="incomingList.length"
      :items="incomingList"
      :model-value="incoming"
      @update:model-value="inputIncoming"
    />

    <UButton v-else block class="mt-4" @click="edit">
      Add incoming category
    </UButton>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'
import { useActionsStore } from '~/store/actions'

const router = useRouter()
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

const edit = () => router.push('/dist/edit')

watch(hasValue, (value) => {
  if (value) {
    actionsStore.setActions({
      edit,
      cancel: resetAll,
      submit: save,
    })
  } else {
    actionsStore.setActions({
      edit,
    })
  }
})

onMounted(() => actionsStore.setActions({ edit }))
</script>
