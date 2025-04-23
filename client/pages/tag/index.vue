<script setup lang="ts">
const { tagStoreRefs: { data }, tagStore: { delete: deleteTag } } = useTagStore()
const { t } = useI18n()
const actionsStore = useActionsStore()
const router = useRouter()

const searchInp = shallowRef('')
const debouncedSearch = refDebounced(searchInp, 300)
const tagIdToDelete = ref<null | number>(null)

const list = computed(() => data.value.filter(t => t.name.includes(debouncedSearch.value)))

function onDelete(id: number) {
  tagIdToDelete.value = id
}

async function deleteItem() {
  if (tagIdToDelete.value) {
    await deleteTag(tagIdToDelete.value)
  }

  tagIdToDelete.value = null
}

function goToEdit(id: number) {
  router.push(`/tag/edit/${id}`)
}

function setActions() {
  actionsStore.setActions({
    add: () => router.push('/tag/add'),
  })
}

function back() {
  router.push('/')
}

onMounted(() => {
  setActions()
})
</script>

<template>
  <ClientOnly>
    <Teleport to="#headerTeleport">
      <UiBackButton class="mr-2" @click="back" />
    </Teleport>
  </ClientOnly>

  <div>
    <div class="p-2 mb-2">
      <h3 class="text-2xl font-bold mb-4">
        {{ t('tag.list') }}
      </h3>

      <UInput
        v-model="searchInp"
        :placeholder="t('tag.search')"
        trailing-icon="i-lucide-search"
        size="xl"
        class="w-full"
      />
    </div>

    <ul v-auto-animate>
      <TagBigItem
        v-for="(item, index) in list"
        :key="index" v-bind="item"
        @delete="onDelete(item.id)"
        @click="goToEdit(item.id)"
      />
    </ul>
  </div>

  <CommonModalRemove
    :open="!!tagIdToDelete"
    :title="t('tag.remove')"
    @close="tagIdToDelete = null"
    @remove="deleteItem"
  />
</template>
