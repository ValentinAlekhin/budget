<script setup lang="ts">
import { capitalize, cloneDeep } from 'lodash-es'
import Omit from 'lodash-es/omit'

interface Props {
  actionType: string
  submit: (dto: CreateCategoryRequestDto) => void
  remove: () => void
  color: string | undefined
  type: CategoriesTypeEnum | undefined
  name: string | undefined
  comment: string | undefined
  icon: string | undefined
  plan: number | null | undefined
  planPeriod: CategoriesPlanPeriodEnum | undefined
}

const props = defineProps<Props>()

const defaultState = {
  name: '',
  comment: '',
  plan: null,
  planPeriod: 'month',
}

const categoryType = ref(0)
const color = ref('')
const icon = ref('')
const isIconPickerOpen = ref(false)
const state = ref<CategoryStateWithoutOrder>(cloneDeep(defaultState))

const { tabs } = useCategoryTabs()
const { object, string } = useYap()
const { t } = useI18n()
const toast = useToast()

const currentTabName = computed(() => tabs.value[categoryType.value].slot)

onMounted(() => {
  color.value = props.color || ''
  icon.value = props.icon || ''

  state.value = {
    name: props.name || '',
    comment: props.comment || '',
    plan: props.plan,
    planPeriod: props.planPeriod || 'month',
  }

  if (props.type) {
    categoryType.value = [CategoriesTypeEnum.COST, CategoriesTypeEnum.INC].findIndex(item => item === props.type)
  }
})

class CategoryStateWithoutOrder extends Omit<CategoryState, 'order'> {}
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

const selectedPlanPeriodName = computed(
  () =>
    planPeriodList.value.find(item => item.value === state.value.planPeriod)
      ?.name,
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
    plan: state.value.plan,
    planPeriod: state.value.planPeriod,
    icon: icon.value,
    color: color.value,
    type: currentTabName.value,
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
        <UTabs v-model:model-value="categoryType" :items="tabs" :default-index="0" class="w-full" />
      </div>

      <div class="mb-6 flex items-center justify-between">
        <button class="relative inline-flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-full h-20 w-20" @click="isIconPickerOpen = true">
          <Icon :name="iconToShow" class="size-12" :color="color" />
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

      <UFormField name="comment" class="mb-2">
        <UInput v-model.number="state.comment" size="xl" :placeholder="t('common.comment')" />
      </UFormField>

      <UFormField name="plan" class="mb-2">
        <UInput v-model.number="state.plan" size="xl" :placeholder="t('common.plan')" />
      </UFormField>

      <UFormField
        v-if="state.plan"
        name="planPeriod"
      >
        <USelectMenu
          :model-value="state.planPeriod"
          :options="planPeriodList"
          option-attribute="name"
          size="xl"
          :placeholder="t('common.planPeriod')"
          @change="state.planPeriod = $event.value"
        >
          <template #label>
            {{ selectedPlanPeriodName }}
          </template>
        </USelectMenu>
      </UFormField>

      <UButton block size="xl" class="mt-8" @click="saveCategory">
        {{ t(`common.submit`) }}
      </UButton>
    </UForm>

    <UModal v-model="isIconPickerOpen" :ui="{ width: 'max-w-2xl' }">
      <div class="p-4">
        <UiIconPicker :value="icon" @update:value="setIcon" />
      </div>
    </UModal>
  </div>
</template>
