<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { date, number, object, string } from 'yup'

const props = defineProps({
  open: { type: Boolean },
  record: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close'])

const { recordStore } = useRecordStore()
const { categoryStoreRefs: { costs, incoming, data: categories } } = useCategoryStore()
const { tagStore: { getById: getTagById } } = useTagStore()
const { t } = useI18n()

const schema = object({
  amount: number().required(),
  categoryId: number().required(),
  timestamp: date().required(),
  comment: string(),
  tagId: number().optional().nullable(),
})

const state = ref<{
  amount: number
  categoryId: number
  timestamp: Dayjs
  comment: string
  tagId: number | null
}>({
  amount: 0,
  categoryId: 0,
  timestamp: dayjs(),
  comment: '',
  tagId: null,
})

const form = ref()
const loading = ref(false)

const currentCategory = computed(
  () =>
    categories.value.find(c => c.id === state.value.categoryId),
)
const categoryTags = computed(() => currentCategory.value?.tagIds?.map(id => getTagById(id)))

const formattedDate = computed(() =>
  dayjs(props.record?.timestamp).format('DD.MM.YYYY'),
)

const categoryItems = computed(() => [{
  type: 'label',
  name: t('common.costs'),
}, ...costs.value, {
  type: 'label',
  name: t('common.incoming'),
}, ...incoming.value])

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

function setTag(tagId: number) {
  if (tagId === state.value.tagId) {
    state.value.tagId = null
  }
  else {
    state.value.tagId = tagId
  }
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
    state.value.tagId = record?.tagId
  },
)

watch(() => state.value.categoryId, () => {
  state.value.tagId = null
})
</script>

<template>
  <template>
    <UModal :open="open" @update:open="close">
      <template #content>
        <UCard>
          <template #header>
            <span class="text-xl font-medium dark:text-white">
              {{ t("record.edit", { date: formattedDate }) }}
            </span>
          </template>

          <UForm
            ref="form"
            :schema="schema"
            :state="state"
            @submit.prevent="submit"
          >
            <UFormField :label="t('common.amount')" name="amount">
              <UInput v-model="state.amount" class="w-full" size="xl" />
            </UFormField>

            <UFormField :label="t('common.comment')" name="comment" class="mt-2">
              <UInput v-model="state.comment" class="w-full" size="xl" />
            </UFormField>

            <UFormField
              :label="t('common.category')"
              name="category"
              class="mt-2"
            >
              <USelectMenu
                v-model="state.categoryId"
                :items="categoryItems"
                :icon="currentCategory?.icon"
                label-key="name"
                value-key="id"
                class="w-full"
                size="xl"
              />
            </UFormField>

            <UFormField
              v-if="categoryTags?.length"
              :label="t('common.tag')"
              name="tagId"
              class="mt-2"
            >
              <USelectMenu
                :model-value="state.tagId"
                :items="categoryTags"
                label-key="name"
                value-key="id"
                class="w-full"
                size="xl"
                :placeholder="t('tag.notSelected')"
                @update:model-value="setTag"
              />
            </UFormField>
          </UForm>

          <template #footer>
            <UButton type="submit" block @click="submit">
              {{ t("common.submit") }}
            </UButton>
          </template>
        </UCard>
      </template>
    </UModal>
  </template>
</template>
