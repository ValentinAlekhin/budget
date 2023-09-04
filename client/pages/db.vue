<template>
  <div>
    <UTable class="w-screen overflow-x-auto" :columns="columns" :rows="rows">
      <template #amount-data="{ row }">
        <span> {{ numberWithSpaces(row.amount) }}р </span>
      </template>

      <template #category-data="{ row }">
        <span> {{ getCategoryName(row.category) }} </span>
      </template>

      <template #type-data="{ row }">
        <UBadge :label="row.type" :color="getTypeColor(row)" variant="solid" />
      </template>

      <template #timestamp-data="{ row }">
        <span>
          {{ dayjs(row.timestamp).format("DD.MM.YYYY") }}
        </span>
      </template>

      <template #action-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <div class="flex justify-center mt-10">
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="recordStore.data.length"
      />
    </div>

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
import dayjs from "dayjs";
import { useRecordStore } from "~/store/record";
import { useCategoryStore } from "~/store/category";
import { numberWithSpaces } from "~/utils";

const recordStore = useRecordStore();
const categoriesStore = useCategoryStore();

const getCategoryName = (id: string) =>
  categoriesStore.getById(id)?.name || "Не найдена";

const editRecord = ref(null);
const deleteId = ref("");

const getTypeColor = (row) => {
  switch (row.type) {
    case "cost":
      return "red";

    case "dist":
      return "cyan";

    case "inc":
      return "green";
  }
};

const columns = [
  {
    label: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 100,
  },
  {
    label: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    label: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    label: "Comment",
    dataIndex: "comment",
    key: "comment",
  },
  {
    label: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
  },
  {
    label: "Action",
    key: "action",
    dataIndex: "action",
  },
];

const items = (row) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (editRecord.value = row),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => (deleteId.value = row.id),
    },
  ],
];

const page = ref(1);
const pageCount = 20;

const rows = computed(() =>
  recordStore.data.slice((page.value - 1) * pageCount, page.value * pageCount)
);

const removeRecord = (id: string) => {
  deleteId.value = "";
  recordStore.delete(id);
};
</script>
