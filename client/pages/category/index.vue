<script  lang="ts" setup>
const router = useRouter()
const { currentTab, tabs, currentTabName } = useCategoryTabs()
const {
  categoryStore,
} = useCategoryStore()

function back() {
  router.push('/')
}

async function remove(id: number) {
  await categoryStore.delete(id)
}

async function reorder(payload: UpdateCategoryOrderRequestDto[]) {
  await categoryStore.updateManyOrder(payload)
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

    <UTabs v-model:model-value="currentTab" :items="tabs" class="w-full">
      <template #cost>
        <CategoryEdit
          type="cost"
          :tab="currentTabName"
          @remove="remove"
          @reorder="reorder"
        />
      </template>
      <template #inc>
        <CategoryEdit
          type="inc"
          :tab="currentTabName"
          @remove="remove"
          @reorder="reorder"
        />
      </template>
    </UTabs>
  </div>
</template>
