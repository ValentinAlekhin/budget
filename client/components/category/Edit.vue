<script setup lang="ts">
import { capitalize, cloneDeep, get, last } from 'lodash-es'
import Omit from 'lodash-es/omit'
import { set } from 'vue-demi'
import Draggable from 'vuedraggable'

const props = defineProps<{ type: 'cost' | 'inc', tab: string }>()
const emit = defineEmits(['submit', 'cancel'])
const actionsStore = useActionsStore()
const {
  categoryStore,
  categoryStoreRefs: { costs, incoming },
} = useCategoryStore()
const toast = useToast()
const { object, string } = useYap()
const { t } = useI18n()

const { tab } = toRefs(props)
const planPeriodList = computed(() =>
  ['day', 'week', 'month', 'quarter', 'year'].map(value => ({
    value,
    name: capitalize(t(`common.${value}`)),
  })),
)

class CategoryState {
  name: string
  order: number
  comment: string
  icon?: string
  plan?: number | null
  planPeriod: string
}
class CategoryStateWithoutOrder extends Omit<CategoryState, 'order'> {}

const categories = computed(() =>
  get(
    {
      inc: incoming.value,
      cost: costs.value,
    },
    props.type,
    [],
  ),
)
const formState = reactive<Record<string, CategoryState>>(
  categories.value.reduce((acc, c, i) => {
    acc[c.id] = {
      order: i + 1,
      name: c.name,
      icon: c.icon,
      comment: c.comment,
      plan: c.plan,
      planPeriod: c.planPeriod,
      color: c.color,
    }

    return acc
  }, {}),
)

const drag = ref<boolean>(false)
const modalOpen = ref<boolean>(false)
const editCategoryId = ref<number | null>(null)
const itemToDelete = ref<any>(null)

const schema = object({
  name: string().required().min(2),
  icon: string().nullable(),
  comment: string().nullable(),
  plan: string().min(0).nullable().optional(),
  planPeriod: string().optional(),
  color: string().optional().nullable(),
})

const defaultState = {
  name: '',
  icon: '',
  comment: '',
  plan: null,
  color: null,
  planPeriod: 'month',
}
const state = ref<CategoryStateWithoutOrder>(cloneDeep(defaultState))
const clearState = () => (state.value = cloneDeep(defaultState))

const form = ref()

const dragOptions = {
  animation: 150,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}

const selectedPlanPeriodName = computed(
  () =>
    planPeriodList.value.find(item => item.value === state.value.planPeriod)
      ?.name,
)

const computedInputs = computed({
  get: () =>
    categories.value
      .map(({ id }, i) => {
        const namePath = `${id}.name`
        const orderPath = `${id}.order`
        const iconPath = `${id}.icon`
        const colorPath = `${id}.color`
        const planPeriodPath = `${id}.planPeriod`
        const name = get(formState, namePath, '')
        const order = get(formState, orderPath, i + 1)
        const icon = get(formState, iconPath, '')
        const color = get(formState, colorPath)
        const planPeriod = get(formState, planPeriodPath)

        return {
          id,
          name,
          order,
          icon,
          color,
          planPeriod,
          comment: get(formState, `${id}.comment`),
          plan: get(formState, `${id}.plan`),
          setName: e => set(formState, namePath, e.target.value),
          setOrder: order => set(formState, orderPath, order),
          setIcon: e => set(formState, iconPath, e.target.value),
          setColor: e => set(formState, colorPath, e),
          setPlanPeriod: e => set(formState, planPeriodPath, e),
        }
      })
      .sort((a, b) => a.order - b.order),
  set: value => value.forEach((item, i) => item.setOrder(i + 1)),
})

function startEditCategory(categoryId: number) {
  const targetCategory = categoryStore.getById(categoryId)
  state.value = {
    name: targetCategory.name,
    icon: targetCategory.icon,
    comment: targetCategory.comment,
    plan: targetCategory.plan,
    planPeriod: targetCategory.planPeriod,
    color: targetCategory.color,
  }
  editCategoryId.value = categoryId
  modalOpen.value = true
}
async function save(redirect = true) {
  const payload = computedInputs.value.map(
    ({ id, order, name, icon, comment, plan, color, planPeriod }) => ({
      id,
      order,
      name,
      icon,
      comment,
      planPeriod,
      plan: plan || null,
      color: color || null,
      type: props.type,
    }),
  )

  await categoryStore.updateMany(payload)

  if (redirect)
    emit('submit')
}
async function submitModal() {
  try {
    await form.value?.validate()
  }
  catch (e) {
    return toast.add({ title: 'Invalid form' })
  }

  if (editCategoryId.value) {
    formState[editCategoryId.value] = {
      ...formState[editCategoryId.value],
      ...state.value,
      plan: +state.value.plan,
    }

    await save(false)
  }
  else {
    const payload = {
      name: state.value.name,
      icon: state.value.icon,
      comment: state.value.comment,
      plan: +state.value.plan,
      planPeriod: state.value.planPeriod,
      color: state.value.color,
      type: props.type,
      order: (last(categories.value)?.order || 0) + 1,
    }

    await categoryStore.addCategory(payload)
  }

  modalOpen.value = false
  editCategoryId.value = null
}

async function removeItem(id: string) {
  await categoryStore.delete(id)
  itemToDelete.value = null
}

function modalClose() {
  editCategoryId.value = null
  clearState()
}

const cardUi = {
  body: {
    padding: 'p-3 sm:p-6',
  },
}

watch(categories, value =>
  cloneDeep(value)
    .sort((a, b) => a.order - b.order)
    .forEach(
      (c, i) =>
        (formState[c.id] = {
          order: i + 1,
          name: c.name,
          icon: c.icon,
          plan: c.plan,
          planPeriod: c.planPeriod,
          comment: c.comment,
          color: c.color,
        }),
    ))

function setActions() {
  if (props.type !== tab.value)
    return

  actionsStore.setActions({
    add: () => (modalOpen.value = true),
    submit: save,
    cancel: () => emit('cancel'),
  })
}

watch(modalOpen, (value) => {
  if (!value)
    clearState()
})

watch(tab, () => {
  setActions()
})

onMounted(() => {
  setActions()
})
</script>

<template>
  <div class="pb-40">
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
        <UCard class="mb-2" :ui="cardUi">
          <div class="inputContainer grid items-center gap-1">
            <UButton
              size="sm"
              color="rose"
              icon="i-heroicons-trash"
              :ui="{ rounded: 'rounded-full' }"
              variant="ghost"
              @click="itemToDelete = element"
            />

            <div class="flex items-center">
              <div
                v-if="element.color || element.icon"
                class="mr-2 flex w-6 justify-center"
              >
                <Icon
                  v-if="element.icon"
                  :color="element.color"
                  :name="element.icon"
                  size="24"
                />

                <span
                  v-else-if="element.color"
                  :style="{ background: element.color }"
                  class="inline-block size-2 rounded-full"
                />
              </div>

              <span> {{ element.name }}</span>
            </div>

            <UButton
              size="sm"
              icon="i-heroicons-pencil-square"
              variant="ghost"
              @click="startEditCategory(element.id)"
            />

            <UButton
              class="handle"
              size="sm"
              :ui="{ rounded: 'rounded-full' }"
              icon="i-heroicons-arrows-up-down"
              variant="ghost"
            />
          </div>
        </UCard>
      </template>
    </Draggable>

    <UModal v-model="modalOpen" @close="modalClose">
      <UCard>
        <template #header>
          <span class="text-xl font-medium dark:text-white">
            {{ $t("category.add") }}
          </span>
        </template>

        <UForm ref="form" :schema="schema" :state="state">
          <UFormGroup :label="$t('common.name')" name="name" class="mb-2">
            <UInput v-model="state.name" />
          </UFormGroup>

          <UFormGroup :label="$t('common.plan')" name="plan" class="mb-2">
            <UInput v-model.number="state.plan" />
          </UFormGroup>

          <UFormGroup
            v-if="state.plan"
            :label="$t('common.planPeriod')"
            name="planPeriod"
            class="mb-2"
          >
            <USelectMenu
              :model-value="state.planPeriod"
              :options="planPeriodList"
              option-attribute="name"
              @change="state.planPeriod = $event.value"
            >
              <template #label>
                {{ selectedPlanPeriodName }}
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup :label="$t('common.comment')" name="comment" class="mb-2">
            <UInput v-model="state.comment" />
          </UFormGroup>

          <UFormGroup :label="$t('common.icon')" name="icon" class="mb-2">
            <UInput v-model="state.icon" class="mb-1">
              <template v-if="state.icon" #trailing>
                <Icon :name="state.icon" size="24" />
              </template>
            </UInput>

            <span
              class="text-sm text-neutral-400"
              v-html="$t('icon.resource')"
            />
          </UFormGroup>

          <UFormGroup name="color">
            <UiTailwindColorPicker v-model="state.color" />
          </UFormGroup>
        </UForm>

        <template #footer>
          <UButton block @click="submitModal">
            {{ $t(`common.${editCategoryId ? "edit" : "add"}`) }}
          </UButton>
        </template>
      </UCard>
    </UModal>

    <common-modal-remove
      :is-open="!!itemToDelete"
      :title="`Remove category '${itemToDelete?.name}'?`"
      @close="itemToDelete = null"
      @remove="removeItem(itemToDelete?.id)"
    />
  </div>
</template>

<style lang="scss" scoped>
.inputContainer {
  grid-template-columns: 30px 1fr 30px 30px;
}
</style>
