<script lang="ts" setup>
const { currentTab, tabs, currentTabName } = useCategoryTabs()

const router = useRouter()
const move = () => router.push('/')
</script>

<template>
  <div>
    <ClientOnly>
      <MobileOnly>
        <Teleport to="#headerTeleport">
          <UiBackButton class="mr-2" @click="move" />
        </Teleport>
      </MobileOnly>
    </ClientOnly>

    <UTabs v-model:model-value="currentTab" :items="tabs" class="w-full">
      <template #cost>
        <CategoryEdit
          type="cost"
          :tab="currentTabName"
          @submit="move"
          @cancel="move"
        />
      </template>
      <template #inc>
        <CategoryEdit
          type="inc"
          :tab="currentTabName"
          @submit="move"
          @cancel="move"
        />
      </template>
    </UTabs>
  </div>
</template>
