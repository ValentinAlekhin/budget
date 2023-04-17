<template>
  <div class="db">
    <a-table
      :columns="columns"
      :data-source="recordStore.data"
      :pagination="{ pageSize: 30 }"
      :scroll="{ x: 700, y: 'calc(100vh - 220px)' }"
    >
      <template #bodyCell="{ column, text, record }">
        <span v-if="column.dataIndex === 'amount'">
          {{ numberWithSpaces(text) }}р
        </span>

        <span v-if="column.dataIndex === 'category'">
          {{ getCategoryName(text) }}
        </span>

        <a-tag v-if="column.dataIndex === 'type'" :color="getTypeColor(text)">
          {{ text }}
        </a-tag>

        <span v-else-if="column.dataIndex === 'timestamp'">
          {{ dayjs(text).format("DD.MM.YYYY") }}
        </span>

        <template v-else-if="column.dataIndex === 'action'">
          <a-button class="mb-2" @click="startEdit(record)">
            Редактировать
          </a-button>
          <a-button type="danger" @click="showDeleteConfirm(record)">
            Удалить
          </a-button>
        </template>
      </template>
    </a-table>

    <a-modal
      :visible="editId"
      :title="`Редактирование записи '${editId}'`"
      @ok="save"
      @cancel="editId = null"
    >
      <a-form :model="formState">
        <a-form-item
          name="amount"
          :rules="[{ required: true, message: 'Please input amount!' }]"
        >
          <a-input
            v-model:value="formState.amount"
            placeholder="Сумма"
            type="number"
          />
        </a-form-item>

        <a-form-item name="category">
          <a-select
            ref="select"
            v-model:value="formState.category"
            :options="categoryOptions"
          />
        </a-form-item>

        <a-form-item name="category">
          <a-select
            ref="select"
            v-model:value="formState.type"
            :options="typeOptions"
          />
        </a-form-item>

        <a-form-item>
          <a-date-picker v-model:value="formState.timestamp" />
        </a-form-item>

        <a-form-item name="comment">
          <a-input
            v-model:value="formState.comment"
            placeholder="Комментарий"
          />
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button key="back" @click="editId = null">Отмена</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="save">
          Сохранить
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from "dayjs";
import { Modal, TableColumnsType } from "ant-design-vue";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-svg";
import { useRecordStore } from "~/store/record";
import { useCategoryStore } from "~/store/category";
import { numberWithSpaces } from "~/utils";

const recordStore = useRecordStore();
const categoriesStore = useCategoryStore();

const getCategoryName = (id: string) =>
  categoriesStore.getById(id)?.name || "Не найдена";

const editId = ref(null);
const loading = ref(false);

const categoryOptions = computed(() =>
  categoriesStore.data.map((c) => ({ value: c.id, label: c.name }))
);

interface FormStateI {
  amount: number;
  category: string;
  type: string;
  comment: string;
  timestamp: Dayjs;
}

const formState = reactive<FormStateI>({
  amount: 0,
  category: "",
  type: "",
  timestamp: dayjs(),
  comment: "",
});

const startEdit = (record) => {
  editId.value = record.id;

  formState.amount = record.amount;
  formState.category = record.category;
  formState.type = record.type;
  formState.comment = record.comment;
  formState.timestamp = dayjs(record.timestamp);
};

const save = async () => {
  await recordStore.update({
    ...formState,
    id: editId.value,
    timestamp: formState.timestamp.toISOString(),
    amount: Number(formState.amount),
  });
  editId.value = null;
};

const showDeleteConfirm = (record) =>
  Modal.confirm({
    title: "Удалить запись?",
    icon: createVNode(ExclamationCircleOutlined),
    okText: "Удалить",
    okType: "danger",
    cancelText: "Отмена",
    async onOk() {
      await recordStore.delete(record.id);
    },
  });

const getTypeColor = (type: string) => {
  switch (type) {
    case "cost":
      return "volcano";

    case "dist":
      return "geekblue";

    case "inc":
      return "green";
  }
};

const columns: TableColumnsType = [
  {
    title: "Сумма",
    dataIndex: "amount",
    key: "amount",
    width: 100,
  },
  {
    title: "Катерогия",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Тип",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Коммент",
    dataIndex: "comment",
    key: "comment",
  },
  {
    title: "Время",
    dataIndex: "timestamp",
    key: "timestamp",
  },
  {
    title: "Действие",
    key: "action",
    dataIndex: "action",
  },
];

const typeOptions = ["cost", "dist", "inc"].map((n) => ({
  value: n,
  label: n,
}));
</script>

<style lang="scss" scoped>
.db {
  //overflow: auto;
  //width: 100vw;
  //height: calc(100vh - 110px);
}

.cost {
  color: red;
}

.inc {
  color: greenyellow;
}

.inc {
  color: greenyellow;
}
</style>
