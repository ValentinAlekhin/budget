<script setup lang="ts">
import { cloneDeep, get } from 'lodash-es'
import { set } from 'vue-demi'
import Draggable from 'vuedraggable'

const props = defineProps<{ type: 'cost' | 'inc', tab: string }>()
defineEmits<{
  (e: 'remove', payload: number): void
  (e: 'reorder', payload: UpdateCategoryOrderRequestDto[]): void
}>()

const actionsStore = useActionsStore()
const {
  categoryStore,
  categoryStoreRefs: { costs, incoming },
} = useCategoryStore()
const router = useRouter()

const { tab } = toRefs(props)

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

const orderState = reactive<Record<string, number>>(
  categories.value.reduce((acc, c, i) => {
    acc[c.id] = i + 1

    return acc
  }, {}),
)

const drag = ref<boolean>(false)
const itemToDelete = ref<null, number>(null)

const dragOptions = {
  animation: 150,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}

const debouncedReorderEmit = useDebounceFn(async () => {
  const orderPayload: UpdateCategoryOrderRequestDto[] = Object.entries(orderState)
    .map(([id, order]) => ({ id: +id, order }))
    .filter((item) => {
      const category = categories.value.find(c => c.id === item.id)
      if (!category)
        return false

      return category.order !== item.order
    })
  await categoryStore.updateManyOrder(orderPayload)
}, 500)

const computedInputs = computed({
  get: () =>
    categories.value
      .map((item, i) => {
        const { id } = item
        const order = get(orderState, id, i + 1)

        return {
          ...item,
          order,
          setOrder: order => set(orderState, id, order),
        }
      })
      .sort((a, b) => a.order - b.order),
  set: (value) => {
    value.forEach((item, i) => item.setOrder(i + 1))
    debouncedReorderEmit()
  },
})

function startEditCategory(categoryId: number) {
  router.push(`/category/edit/${categoryId}`)
}

async function removeItem() {
  if (!itemToDelete.value)
    return

  await categoryStore.delete(itemToDelete.value)
  itemToDelete.value = null
}

watch(categories, value =>
  cloneDeep(value)
    .sort((a, b) => a.order - b.order)
    .forEach(
      (c, i) =>
        (orderState[c.id] = i + 1),
    ))

function setActions() {
  if (props.type !== tab.value)
    return

  actionsStore.setActions({
    add: () => router.push('/category/add'),
  })
}

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
        <UCard class="mb-2 cursor-pointer" @click="startEditCategory(element.id)">
          <div class="flex justify-between items-center gap-1">
            <div class="flex items-center">
              <div
                v-if="element.color || element.icon"
                class="mr-2 flex w-6 justify-center"
              >
                <UIcon
                  v-if="element.icon"
                  :style="{ color: element.color }"
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

            <div>
              <UButton
                size="md"
                color="white"
                icon="i-heroicons-trash"
                variant="ghost"
                @click.stop="itemToDelete = element.id"
              />

              <UButton
                class="handle"
                color="white"
                size="md"
                icon="i-heroicons-arrows-up-down"
                variant="ghost"
                @click.stop
              />
            </div>
          </div>
        </UCard>
      </template>
    </Draggable>

    <common-modal-remove
      :open="!!itemToDelete"
      :title="$t('category.remove')"
      @close="itemToDelete = null"
      @remove="removeItem"
    />
  </div>
</template>
