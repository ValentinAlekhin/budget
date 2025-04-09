<script lang="ts" setup>
const {
  recordStoreRefs: { data: list },
  recordStore,
} = useRecordStore()

const editRecord = ref<any>(null)
const deleteId = ref('')

const { smallerThanLg } = useScreenSize()

function removeRecord(id: string) {
  deleteId.value = ''
  recordStore.delete(id)
}
</script>

<template>
  <div>
    <RecordsList
      v-if="smallerThanLg"
      :rows="list"
      @edit="editRecord = $event"
      @delete="deleteId = $event.id"
    />

    <RecordsEditModal
      :open="!!editRecord"
      :record="editRecord"
      @close="editRecord = null"
    />

    <common-modal-remove
      :open="!!deleteId"
      @close="deleteId = ''"
      @remove="removeRecord(deleteId)"
    />
  </div>
</template>
