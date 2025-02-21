<script setup lang="ts">
import type { InferType } from 'yup'
import { capitalize, cloneDeep } from 'lodash-es'
import Omit from 'lodash-es/omit'

const categoryType = ref(0)
const color = ref('')
const icon = ref('')
const isIconPickerOpen = ref(false)

const { tabs } = useCategoryTabs()
const { object, string } = useYap()
const { t } = useI18n()
const toast = useToast()

const defaultState = {
  name: '',
  comment: '',
  plan: null,
  planPeriod: 'month',
}

const state = ref<CategoryStateWithoutOrder>(cloneDeep(defaultState))
const clearState = () => (state.value = cloneDeep(defaultState))

class CategoryStateWithoutOrder extends Omit<CategoryState, 'order'> {}
const schema = object({
  name: string().required().min(2).max(20),
  comment: string().nullable(),
  plan: string().min(1).nullable().optional(),
  planPeriod: string().optional(),
})

type Schema = InferType<typeof schema>

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

// Функция сохранения категории (пример)
async function saveCategory() {
  try {
    await form.value?.validate()
  }
  catch (e) {
    console.error(e)
    return toast.add({ title: 'Invalid form' })
  }

  console.log({
    type: categoryType.value,
    color: color.value,
    icon: icon.value,
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center pt-2">
    <UForm ref="form" :schema="schema" :state="state" class="w-full max-w-md pl-2 pr-2 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold  mb-8 text-center">
        {{ t("category.add") }}
      </h1>

      <div class="mb-6">
        <UTabs v-model:model-value="categoryType" :items="tabs" :default-index="0" class="w-full" />
      </div>

      <div class="mb-6 flex items-center justify-between">
        <button class="relative inline-flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-full h-20 w-20" @click="isIconPickerOpen = true">
          <Icon :name="iconToShow" class="size-12" :color="color" />
        </button>
        <UFormGroup name="name" class="w-64">
          <UInput
            v-model="state.name"
            :placeholder="t('common.name')"
            size="xl"
          />
        </UFormGroup>
      </div>

      <div class="mb-6">
        <UiColorPicker v-model:value="color" />
      </div>

      <UFormGroup name="plan" class="mb-2">
        <UInput v-model.number="state.plan" size="xl" :placeholder="t('common.plan')" />
      </UFormGroup>

      <UFormGroup
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
      </UFormGroup>

      <UButton block size="xl" class="mt-8" @click="saveCategory">
        {{ t(`common.${false ? "edit" : "add"}`) }}
      </UButton>
    </UForm>

    <UModal v-model="isIconPickerOpen" :ui="{ width: 'max-w-2xl' }">
      <div class="p-4">
        <UiIconPicker :value="icon" @update:value="setIcon" />
      </div>
    </UModal>
  </div>
</template>
