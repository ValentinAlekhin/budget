<template>
  <div class="pb-40">
    <ClientOnly>
      <MobileOnly>
        <Teleport to="#headerTeleport">
          <BackButton class="mr-2" to="/" />
        </Teleport>
      </MobileOnly>
    </ClientOnly>

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
              <span class="mr-2"> {{ element.name }}</span>
              <Icon v-if="element.icon" :name="element.icon" size="24" />
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

    <UModal v-model="modalOpen">
      <UCard>
        <template #header>
          <span class="text-xl font-medium dark:text-white">
            Add new category
          </span>
        </template>

        <UForm ref="form" :schema="schema" :state="state">
          <UFormGroup label="Name" name="name" class="mb-2">
            <UInput v-model="state.name" />
          </UFormGroup>

          <UFormGroup label="Plan" name="plan" class="mb-2">
            <UInput v-model="state.plan" />
          </UFormGroup>

          <UFormGroup label="Comment" name="comment" class="mb-2">
            <UInput v-model="state.comment" />
          </UFormGroup>

          <UFormGroup label="Icon" name="icon">
            <UInput v-model="state.icon" class="mb-1">
              <template v-if="state.icon" #trailing>
                <Icon :name="state.icon" size="24" />
              </template>
            </UInput>

            <span class="text-sm text-neutral-400"
              >Search icons
              <a
                href="https://icon-sets.iconify.design/"
                target="_blank"
                class="text-cyan-500 underline"
                >here</a
              >
            </span>
          </UFormGroup>
        </UForm>

        <template #footer>
          <UButton block @click="submitModal">
            {{ editCategoryId ? 'Update' : 'Add' }}
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

<script setup lang="ts">
import Draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'
import { number, object, string } from 'yup'
import { cloneDeep, get, last } from 'lodash-es'
import { set } from 'vue-demi'
import Omit from 'lodash-es/omit'
import { useCategoryStore } from '~/store/category'
import { useActionsStore } from '~/store/actions'
import BackButton from '~/components/ui/BackButton.vue'
import MobileOnly from '~/components/ui/MobileOnly.vue'

const actionsStore = useActionsStore()
const categoryStore = useCategoryStore()
const toast = useToast()
const { costs } = storeToRefs(categoryStore)
const router = useRouter()

class CategoryState {
  name: string
  order: number
  comment: string
  icon?: string
  plan?: number | null
}
class CategoryStateWithoutOrder extends Omit<CategoryState, 'order'> {}

const formState = reactive<Record<string, CategoryState>>(
  costs.value.reduce((acc, c, i) => {
    acc[c.id] = {
      order: i + 1,
      name: c.name,
      icon: c.icon,
      comment: c.comment,
      plan: c.plan,
    }

    return acc
  }, {})
)
const drag = ref<boolean>(false)
const modalOpen = ref<boolean>(false)
const editCategoryId = ref<string | null>(null)
const itemToDelete = ref<any>(null)

const schema = object({
  name: string().required('Category name required').min(2),
  icon: string().nullable(),
  comment: string().nullable(),
  plan: number().min(0).nullable(),
})

const defaultState = {
  name: '',
  icon: '',
  comment: '',
  plan: null,
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

watch(
  costs,
  (value) =>
    value.forEach(
      (c, i) => (formState[c.id] = { order: i + 1, name: c.name, icon: c.icon })
    ),
  {
    deep: true,
  }
)

const computedInputs = computed({
  get: () =>
    costs.value
      .map(({ id }, i) => {
        const namePath = `${id}.name`
        const orderPath = `${id}.order`
        const iconPath = `${id}.icon`
        const name = get(formState, namePath, '')
        const order = get(formState, orderPath, i + 1)
        const icon = get(formState, iconPath, '')

        return {
          id,
          name,
          order,
          icon,
          comment: get(formState, `${id}.comment`),
          plan: get(formState, `${id}.plan`),
          setName: (e) => set(formState, namePath, e.target.value),
          setOrder: (order) => set(formState, orderPath, order),
          setIcon: (e) => set(formState, iconPath, e.target.value),
        }
      })
      .sort((a, b) => a.order - b.order),
  set: (value) => value.forEach((item, i) => item.setOrder(i + 1)),
})

const startEditCategory = (categoryId: string) => {
  const targetCategory = categoryStore.getById(categoryId)
  state.value = {
    name: targetCategory.name,
    icon: targetCategory.icon,
    comment: targetCategory.comment,
    plan: targetCategory.plan,
  }
  editCategoryId.value = categoryId
  modalOpen.value = true
}
const save = async () => {
  const payload = computedInputs.value.map(
    ({ id, order, name, icon, comment, plan }) => ({
      id,
      order,
      name,
      icon,
      comment,
      plan,
      type: 'cost',
    })
  )

  await categoryStore.updateMany(payload)
  await router.push('/')
}

const saveNewCategory = async () => {
  try {
    await form.value?.validate()
  } catch (e) {
    return toast.add({ title: 'Invalid form' })
  }

  const payload = {
    name: state.value.name,
    icon: state.value.icon,
    comment: state.value.comment,
    plan: state.value.plan,
    type: 'cost',
    order: (last(categoryStore.costs)?.order || 0) + 1,
  }

  await categoryStore.addCategory(payload)
  modalOpen.value = false
}

const setUpdatedCategory = () => {
  formState[editCategoryId.value] = {
    ...formState[editCategoryId.value],
    ...state.value,
    plan: +state.value.plan,
  }
  editCategoryId.value = null
}

const submitModal = async () => {
  try {
    await form.value?.validate()
  } catch (e) {
    return toast.add({ title: 'Invalid form' })
  }

  editCategoryId ? setUpdatedCategory() : await saveNewCategory()

  modalOpen.value = false
}

const removeItem = async (id: string) => {
  await categoryStore.delete(id)
  itemToDelete.value = null
}

const cardUi = {
  body: {
    padding: 'px-6 py-3 sm:p-6',
  },
}

watch(modalOpen, (value) => {
  if (!value) clearState()
})

onMounted(() =>
  actionsStore.setActions({
    add: () => (modalOpen.value = true),
    submit: save,
    cancel: () => router.push('/'),
  })
)
</script>

<style lang="scss" scoped>
.inputContainer {
  grid-template-columns: 30px 1fr 30px 30px;
}
</style>
