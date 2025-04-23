<script setup lang="ts">
const {
  categoryStore,
} = useCategoryStore()
const router = useRouter()
const route = useRoute()

const isRemoveModalOpen = ref(false)

const id = +route.params.id
const category = computed(() => categoryStore.getById(id))

if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

function back() {
  router.push('/edit')
}

async function edit(dto: CreateCategoryRequestDto) {
  await categoryStore.updateOne({ ...dto, order: category.value?.order, id })
  back()
}

function closeModal() {
  isRemoveModalOpen.value = false
}

async function remove() {
  await categoryStore.delete(id)
  back()
}

onMounted(() => {
  console.log(category.value)
})
</script>

<template>
  <div>
    <ClientOnly>
      <Teleport to="#headerTeleport">
        <UiBackButton class="mr-2" @click="back" />
      </Teleport>
    </ClientOnly>

    <CategoryAddEdit
      action-type="edit"
      :name="category.name"
      :tag-ids="category.tagIds"
      :icon="category.icon"
      :color="category.color"
      :comment="category.comment"
      :plan-period="category.planPeriod"
      :plan="category.plan"
      :type="category.type"
      :submit="edit"
    />

    <common-modal-remove
      :is-open="isRemoveModalOpen"
      :title="`Remove category '${category?.name}'?`"
      @close="closeModal"
      @remove="remove"
    />
  </div>
</template>
