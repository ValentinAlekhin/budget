<script lang="ts" setup>
const router = useRouter()
const { tagStore: { create } } = useTagStore()

function back() {
  router.push('/tag')
}

async function submit(dto: CreateTagRequestDto) {
  await create(dto)
  back()
}
</script>

<template>
  <ClientOnly>
    <Teleport to="#headerTeleport">
      <UiBackButton class="mr-2" @click="back" />
    </Teleport>
  </ClientOnly>

  <div>
    <TagAddEdit action-type="add" :submit="submit" />
  </div>
</template>
