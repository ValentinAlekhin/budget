<script setup lang="ts">
const {
  categoryStore,
  categoryStoreRefs: { data },
} = useCategoryStore()
const router = useRouter()

function back() {
  router.push('/category')
}

async function add(dto: UpdateCategoryRequestDto) {
  await categoryStore.addCategory({ ...dto, order: data.value.length })
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

    <CategoryAddEdit :submit="add" action-type="add" />
  </div>
</template>
