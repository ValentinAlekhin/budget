<template>
  <div class="category-edit">
    <div class="header">
      <div>
        <a-button
          class="mb-3 mr-4"
          type="primary"
          shape="circle"
          @click="router.back"
        >
          <template #icon><ArrowLeftOutlined /></template>
        </a-button>
        <a-typography-title style="display: inline-block" :level="5">
          Настройки категорий
        </a-typography-title>
      </div>

      <a-button
        class="mb-3 mr-4"
        type="primary"
        shape="circle"
        @click="addModal = true"
      >
        <template #icon><PlusOutlined /></template>
      </a-button>
    </div>

    <Draggable
      v-model="computedInputs"
      class="list-group"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      item-key="id"
      handle=".handle"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{ element }">
        <div class="item">
          <a-button size="large" @click="showDeleteConfirm(element)">
            <template #icon> <DeleteOutlined /> </template>
          </a-button>

          <a-input
            size="large"
            :value="element.name"
            :suffix="element.order"
            @input="element.setName"
          />

          <a-button class="handle" size="large">
            <template #icon> <MenuOutlined /> </template>
          </a-button>
        </div>
      </template>
    </Draggable>

    <a-button :disabled="!canSave" @click="save">Сохранить</a-button>

    <a-modal
      :visible="addModal"
      title="Добавление новой категории трат"
      @ok="saveNew"
      @cancel="addModal = false"
    >
      <a-form :model="newFormState">
        <a-form-item
          name="name"
          :rules="[{ required: true, message: 'Введите имя' }]"
        >
          <a-input v-model:value="newFormState.name" placeholder="Имя" />
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button key="back" @click="addModal = false">Отмена</a-button>
        <a-button
          key="submit"
          :disabled="!validNew"
          type="primary"
          :loading="false"
          @click="saveNew"
        >
          Добавить
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import Draggable from "vuedraggable";
import { get, last, set } from "lodash";
import { Modal } from "ant-design-vue";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-svg";
import { storeToRefs } from "pinia";
import { useCategoryStore } from "~/store/category";

const categoryStore = useCategoryStore();
const { costs } = storeToRefs(categoryStore);
const router = useRouter();

const formState = reactive<Record<string, { name: string; order: number }>>(
  costs.value.reduce((acc, c, i) => {
    acc[c.id] = { order: i + 1, name: c.name };

    return acc;
  }, {})
);
const drag = ref<boolean>(false);

const newFormState = reactive<{ name: string }>({ name: "" });
const addModal = ref<boolean>(false);
const validNew = computed(() => newFormState.name?.length >= 2);

watch(
  costs,
  (value) =>
    value.forEach((c, i) => (formState[c.id] = { order: i + 1, name: c.name })),
  {
    deep: true,
  }
);

const computedInputs = computed({
  get: () =>
    costs.value
      .map(({ id }, i) => {
        const namePath = `${id}.name`;
        const orderPath = `${id}.order`;
        const name = get(formState, namePath, "");
        const order = get(formState, orderPath, i + 1);

        return {
          id,
          name,
          order,
          setName: (e) => set(formState, namePath, e.target.value),
          setOrder: (order) => set(formState, orderPath, order),
        };
      })
      .sort((a, b) => a.order - b.order),
  set: (value) => value.forEach((item, i) => item.setOrder(i + 1)),
});

const canSave = computed(() => computedInputs.value.every((inp) => inp.name));

const dragOptions = {
  animation: 150,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
};

const save = async () => {
  const payload = computedInputs.value.map(({ id, order, name }) => ({
    id,
    order,
    name,
    type: "cost",
  }));

  await categoryStore.updateMany(payload);

  await router.push("/");
};

const saveNew = async () => {
  const payload = {
    name: newFormState.name,
    type: "cost",
    order: (last(categoryStore.costs)?.order || 0) + 1,
  };

  await categoryStore.addCategory(payload);
  addModal.value = false;
};

const showDeleteConfirm = (category) =>
  Modal.confirm({
    title: `Удалить категорию "${category.name}"?`,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "Удалить",
    okType: "danger",
    cancelText: "Отмена",
    async onOk() {
      await categoryStore.delete(category.id);
    },
  });
</script>

<style lang="scss" scoped>
.category-edit {
  .header {
    padding: 10px 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<style lang="scss">
.ant-input-group-addon {
  font-size: 18px;
}
</style>
