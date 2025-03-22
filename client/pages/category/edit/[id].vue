<script setup lang="ts">
const {
  categoryStore,
} = useCategoryStore()
const router = useRouter()
const route = useRoute()

const isRemoveModalOpen = ref(false)

const id = route.params.id
const category = categoryStore.getById(+id)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

function back() {
  router.push('/edit')
}

async function edit(dto: UpdateCategoryRequestDto) {
  await categoryStore.updateOne({ ...dto, order: category?.order, id: category?.id })
  back()
}

function openModal() {
  isRemoveModalOpen.value = true
}

function closeModal() {
  isRemoveModalOpen.value = false
}

async function remove() {
  await categoryStore.delete(id)
  back()
}
</script>

<template>
  <div>
    <ClientOnly>
      <MobileOnly>
        <Teleport to="#headerTeleport">
          <UiBackButton class="mr-2" @click="back" />
        </Teleport>
      </MobileOnly>
    </ClientOnly>

    <CategoryAddEdit
      action-type="edit"
      :name="category?.name"
      :icon="category?.icon"
      :color="category?.color"
      :comment="category?.comment"
      :plan-period="category?.planPeriod"
      :plan="category?.plan"
      :type="category?.type"
      :submit="edit"
      :remove="openModal"
    />

    <common-modal-remove
      :is-open="isRemoveModalOpen"
      :title="`Remove category '${category?.name}'?`"
      @close="closeModal"
      @remove="remove"
    />
  </div>
</template>
