<script  lang="ts" setup>
const router = useRouter()
const { currentTab, tabs, currentTabName } = useCategoryTabs()

function back() {
  router.push('/')
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
        />
      </template>
      <template #inc>
        <CategoryEdit
          type="inc"
          :tab="currentTabName"
        />
      </template>
    </UTabs>
  </div>
</template>
