<template>
  <template>
    <UModal v-model="isOpen" @close="close">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <span class="text-xl font-medium dark:text-white">
            {{ $t('record.edit', { date: formattedDate }) }}
          </span>
        </template>

        <UForm
          ref="form"
          :schema="schema"
          :state="state"
          @submit.prevent="submit"
        >
          <UFormGroup :label="$t('common.amount')" name="amount">
            <UInput v-model="state.amount" />
          </UFormGroup>

          <UFormGroup :label="$t('common.comment')" name="comment" class="mt-2">
            <UInput v-model="state.comment" />
          </UFormGroup>

          <UFormGroup
            :label="$t('common.category')"
            name="category"
            class="mt-2"
          >
            <USelectMenu
              v-model="state.categoryId"
              :options="categoryOptions"
              value-attribute="id"
            >
              <template #label>
                {{ currentCategory.label }}
              </template>
            </USelectMenu>
          </UFormGroup>
        </UForm>

        <template #footer>
          <UButton type="submit" block @click="submit">
            {{ $t('common.submit') }}
          </UButton>
        </template>
      </UCard>
    </UModal>
  </template>
</template>

<script lang="ts" setup>
import { object, string, date, mixed, number } from 'yup'
import dayjs from 'dayjs'
import { useCategoryStore } from '~/store/category'
import { useRecordStore } from '~/store/record'

const recordStore = useRecordStore()
const categoriesStore = useCategoryStore()

const props = defineProps({
  isOpen: { type: Boolean },
  record: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close'])

const isOpen = computed({
  get: () => props.isOpen,
  set: () => emit('close'),
})

const categoryOptions = computed(() =>
  categoriesStore.data.map((c) => ({ id: c.id, label: c.name })),
)

const schema = object({
  amount: number().required(),
  categoryId: mixed().required(),
  timestamp: date().required(),
  comment: string(),
})

const state = ref({
  amount: 0,
  categoryId: '',
  timestamp: dayjs(),
  comment: '',
})

const currentCategory = computed(
  () =>
    categoryOptions.value.find((c) => c.id === state.value.categoryId) || ' ',
)

const form = ref()
const loading = ref(false)

const formattedDate = computed(() =>
  dayjs(props.record?.timestamp).format('DD.MM.YYYY'),
)

const close = () => emit('close')

const submit = async () => {
  loading.value = true
  await recordStore.update({
    ...state.value,
    id: props.record?.id,
    amount: Number(state.value.amount),
  })

  loading.value = false

  close()
}

watch(
  () => props.record,
  (record) => {
    if (!record) return

    state.value.amount = record?.amount
    state.value.categoryId = record?.categoryId
    state.value.timestamp = record?.timestamp
    state.value.comment = record?.comment
  },
)
</script>
