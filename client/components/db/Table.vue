<template>
  <UTable
    class="w-screen overflow-x-auto"
    :columns="columns"
    :rows="props.rows"
  >
    <template #amount-data="{ row }">
      <span> {{ numberWithSpaces(row.amount) }}р </span>
    </template>

    <template #category-data="{ row }">
      <span> {{ getCategoryName(row.category) }} </span>
    </template>

    <template #type-data="{ row }">
      <UBadge
        :label="row.type"
        :color="getTypeColor(row.type)"
        variant="soft"
      />
    </template>

    <template #timestamp-data="{ row }">
      <span>
        {{ dayjs(row.timestamp).format("DD.MM.YYYY") }}
      </span>
    </template>

    <template #action-data="{ row }">
      <DbActionsDropdown
        :record="row"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </template>
  </UTable>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import { numberWithSpaces } from "~/utils";
import { useCategory } from "~/hooks/useCategory";
import { useRecord } from "~/hooks/useRecord";

const { getCategoryName } = useCategory();
const { getTypeColor } = useRecord();

const props = defineProps<{ rows: any[] }>();
const emit = defineEmits(["edit", "delete"]);

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
</script>
