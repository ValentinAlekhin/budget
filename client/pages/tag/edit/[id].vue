<script lang="ts" setup>
const { tagStore: { getById, delete: deleteOne, updateOne } } = useTagStore()
const route = useRoute()
const router = useRouter()

const id = +route.params.id
const currentTag = computed(() => getById(id))

function back() {
  router.push('/tag')
}

async function remove() {
  await deleteOne(id)
  back()
}

async function submit(dto: CreateTagRequestDto) {
  await updateOne({ ...dto, id })
  back()
}

onMounted(() => {
  if (!currentTag.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tag not found',
    })
  }
})
</script>

<template>
  <ClientOnly>
    <Teleport to="#headerTeleport">
      <UiBackButton class="mr-2" @click="back" />
    </Teleport>
  </ClientOnly>

  <TagAddEdit
    v-if="currentTag"
    :id="id"
    action-type="edit"
    :name="currentTag.name"
    :icon="currentTag.icon"
    :color="currentTag.color"
    :remove="remove"
    :submit="submit"
  />
</template>
