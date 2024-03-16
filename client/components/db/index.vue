<template>
  <div>
    <DbList
      v-if="smallerThanLg"
      :rows="list"
      @edit="editRecord = $event"
      @delete="deleteId = $event.id"
    />

    <template v-else>
      <DbTable
        :rows="rows"
        @edit="editRecord = $event"
        @delete="deleteId = $event.id"
      />
      <div class="mt-10 flex justify-center">
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="list.length"
        />
      </div>
    </template>

    <db-edit-modal
      :is-open="!!editRecord"
      :record="editRecord"
      @close="editRecord = null"
    />

    <common-modal-remove
      :is-open="!!deleteId"
      @close="deleteId = ''"
      @remove="removeRecord(deleteId)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRecordStore } from '~/store/record'
import { useScreenSize } from '~/composables/useScreenSize'

const {
  recordStoreRefs: { data: list },
  recordStore,
} = useRecordStore()

const editRecord = ref<any>(null)
const deleteId = ref('')

const page = ref(1)
const pageCount = 20

const { smallerThanLg } = useScreenSize()

const rows = computed(() =>
  list.value.slice((page.value - 1) * pageCount, page.value * pageCount),
)

const removeRecord = (id: string) => {
  deleteId.value = ''
  recordStore.delete(id)
}
</script>
