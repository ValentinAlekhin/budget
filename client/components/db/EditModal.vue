<script lang="ts" setup>
import dayjs from 'dayjs'
import { date, number, object, string } from 'yup'

const props = defineProps({
  open: { type: Boolean },
  record: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close'])
const { recordStore } = useRecordStore()
const { categoryStoreRefs: { data: categories } } = useCategoryStore()

const schema = object({
  amount: number().required(),
  categoryId: number().required(),
  timestamp: date().required(),
  comment: string(),
})

const state = ref({
  amount: 0,
  categoryId: 0,
  timestamp: dayjs(),
  comment: '',
})

const currentCategory = computed(
  () =>
    categories.value.find(c => c.id === state.value.categoryId),
)

const form = ref()
const loading = ref(false)

const formattedDate = computed(() =>
  dayjs(props.record?.timestamp).format('DD.MM.YYYY'),
)

const close = () => emit('close')

async function submit() {
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
    if (!record)
      return

    state.value.amount = record?.amount
    state.value.categoryId = record?.categoryId
    state.value.timestamp = record?.timestamp
    state.value.comment = record?.comment
  },
)
</script>

<template>
  <template>
    <UModal :open="open" @update:open="close">
      <template #content>
        <UCard>
          <template #header>
            <span class="text-xl font-medium dark:text-white">
              {{ $t("record.edit", { date: formattedDate }) }}
            </span>
          </template>

          <UForm
            ref="form"
            :schema="schema"
            :state="state"
            @submit.prevent="submit"
          >
            <UFormField :label="$t('common.amount')" name="amount">
              <UInput v-model="state.amount" class="w-full" />
            </UFormField>

            <UFormField :label="$t('common.comment')" name="comment" class="mt-2">
              <UInput v-model="state.comment" class="w-full" />
            </UFormField>

            <UFormField
              :label="$t('common.category')"
              name="category"
              class="mt-2"
            >
              <USelectMenu
                v-model="state.categoryId"
                :items="categories"
                :icon="currentCategory?.icon"
                label-key="name"
                value-key="id"
                class="w-full"
              />
            </UFormField>
          </UForm>

          <template #footer>
            <UButton type="submit" block @click="submit">
              {{ $t("common.submit") }}
            </UButton>
          </template>
        </UCard>
      </template>
    </UModal>
  </template>
</template>
