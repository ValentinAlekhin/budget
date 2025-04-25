<script setup lang="ts">
import { capitalize, cloneDeep } from 'lodash-es'

interface Props {
  actionType: string
  submit: (dto: CreateCategoryRequestDto) => Promise<void>
  remove?: () => Promise<void>
  color?: string
  type?: CategoriesTypeEnum
  name?: string
  tagIds?: []
  comment?: string
  icon?: string
  plan?: number
  planPeriod?: CategoriesPlanPeriodEnum | undefined
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  tagIds: () => [],
  comment: '',
  icon: '',
  color: '',
  plan: 0,
  planPeriod: CategoriesPlanPeriodEnum.MONTH,
})
const { tabs } = useCategoryTabs()
const { tagStoreRefs: { data: tags } } = useTagStore()
const { object, string } = useYap()
const { t } = useI18n()
const toast = useToast()

const defaultState = {
  name: '',
  tagIds: [],
  comment: '',
  plan: 0,
  planPeriod: 'month',
}

const categoryType = ref('0')
const color = ref('')
const icon = ref('')
const isIconPickerOpen = ref(false)
const state = ref(cloneDeep(defaultState))

const currentTabName = computed(() => tabs.value[categoryType.value].slot)

onMounted(() => {
  color.value = props.color
  icon.value = props.icon

  state.value = {
    name: props.name,
    tagIds: props.tagIds,
    comment: props.comment,
    plan: props.plan,
    planPeriod: props.planPeriod,
  }

  if (props.type) {
    categoryType.value = String([CategoriesTypeEnum.COST, CategoriesTypeEnum.INC].findIndex(item => item === props.type))
  }
})

const schema = object({
  name: string().required().min(2).max(20),
  comment: string().nullable(),
  plan: string().min(1).nullable().optional(),
  planPeriod: string().optional(),
})

const form = ref()

const planPeriodList = computed(() =>
  ['day', 'week', 'month', 'quarter', 'year'].map(value => ({
    value,
    name: capitalize(t(`common.${value}`)),
  })),
)

function setIcon(iconName: string) {
  icon.value = iconName
  isIconPickerOpen.value = false
}

const iconToShow = computed(() => icon.value || 'material-symbols:category-outline-rounded')

async function saveCategory() {
  try {
    await form.value?.validate()
  }
  catch (e) {
    console.error(e)
    return toast.add({ title: 'Invalid form' })
  }

  await props.submit({
    name: state.value.name,
    comment: state.value.comment,
    plan: Number(state.value.plan),
    planPeriod: state.value.planPeriod,
    icon: icon.value,
    color: color.value,
    type: currentTabName.value,
    tagIds: state.value.tagIds,
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center pt-2">
    <UForm ref="form" :schema="schema" :state="state" class="w-full pl-2 pr-2">
      <h1 class="text-2xl font-bold  mb-8">
        {{ t(`category.${actionType}`) }}
      </h1>

      <div class="mb-6">
        <UTabs v-model="categoryType" :items="tabs" :default-index="categoryType" class="w-full" />
      </div>

      <div class="mb-6 flex items-center justify-between">
        <button class="inline-flex items-center justify-center overflow-hidden rounded-full bg-(--ui-bg-elevated) size-16 text-3xl" @click="isIconPickerOpen = true">
          <UIcon :name="iconToShow" :style="{ color }" />
        </button>
        <UFormField name="name" class="w-64">
          <UInput
            v-model="state.name"
            :placeholder="t('common.name')"
            size="xl"
          />
        </UFormField>
      </div>

      <div class="mb-6">
        <UiColorPicker v-model:value="color" />
      </div>

      <UFormField name="tagIds" class="mb-2">
        <USelectMenu v-model="state.tagIds" multiple :items="tags" value-key="id" label-key="name" size="xl" class="w-full" />
      </UFormField>

      <UFormField name="comment" class="mb-2">
        <UInput v-model.number="state.comment" size="xl" :placeholder="t('common.comment')" class="w-full" />
      </UFormField>

      <UFormField name="plan" class="mb-2">
        <UInput v-model.number="state.plan" size="xl" :placeholder="t('common.plan')" class="w-full" />
      </UFormField>

      <UFormField
        v-if="state.plan"
        name="planPeriod"
      >
        <USelectMenu
          v-model="state.planPeriod"
          :items="planPeriodList"
          option-attribute="name"
          size="xl"
          :placeholder="t('common.planPeriod')"
          class="w-full"
          label-key="name"
          value-key="value"
        />
      </UFormField>

      <UButton block size="xl" class="mt-8" @click="saveCategory">
        {{ t(`common.submit`) }}
      </UButton>
    </UForm>

    <UModal v-model:open="isIconPickerOpen">
      <template #content>
        <div class="p-4">
          <UiIconPicker :value="icon" @update:value="setIcon" />
        </div>
      </template>
    </UModal>
  </div>
</template>
