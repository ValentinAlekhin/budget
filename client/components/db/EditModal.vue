<template>
  <template>
    <UModal v-model="isOpen" @close="close">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <span class="dark:text-white font-medium text-xl">
            Редактирование записи {{ record?.id || "" }}
          </span>
        </template>

        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          @submit.prevent="submit"
        >
          <UFormGroup label="Amount" name="amount">
            <UInput v-model="state.amount" />
          </UFormGroup>

          <UFormGroup label="Category" name="category" class="mt-2">
            <USelectMenu
              v-model="state.category"
              :options="categoryOptions"
              value-attribute="id"
            >
              <template #label>
                {{ currentCategory.label }}
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup label="Type" name="type" class="mt-2">
            <USelectMenu v-model="state.type" :options="types" />
          </UFormGroup>
        </UForm>

        <template #footer>
          <UButton type="submit" @click="submit"> Submit </UButton>
        </template>
      </UCard>
    </UModal>
  </template>
</template>

<script lang="ts" setup>
import { object, string, date, mixed, number } from "yup";
import dayjs from "dayjs";
import { any } from "vue-types";
import { useCategoryStore } from "~/store/category";
import { useRecordStore } from "~/store/record";

const recordStore = useRecordStore();
const categoriesStore = useCategoryStore();

const props = defineProps({
  isOpen: { type: Boolean },
  record: { type: any, default: () => ({}) },
});
const emit = defineEmits(["close"]);

const isOpen = computed({
  get: () => props.isOpen,
  set: () => emit("close"),
});

const categoryOptions = computed(() =>
  categoriesStore.data.map((c) => ({ id: c.id, label: c.name }))
);
const types = ["cost", "dist", "inc"];

const schema = object({
  amount: number().required(),
  category: mixed().required(),
  type: mixed().oneOf(types),
  timestamp: date().required(),
  comment: string(),
});

const state = ref({
  amount: 0,
  category: "",
  type: "",
  timestamp: dayjs(),
  comment: "",
});

const currentCategory = computed(
  () => categoryOptions.value.find((c) => c.id === state.value.category) || " "
);

watch(
  () => props.record,
  (record) => {
    if (!record) return;

    state.value.amount = record.amount;
    state.value.category = record.category;
    state.value.type = record.type;
    state.value.timestamp = record.timestamp;
    state.value.comment = record.comment;
  }
);

const form = ref();
const loading = ref(false);

const close = () => emit("close");

const submit = async () => {
  loading.value = true;
  await recordStore.update({
    ...state.value,
    id: props.record.id,
    amount: Number(state.value.amount),
  });

  loading.value = false;

  close();
};
</script>
