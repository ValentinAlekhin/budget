<script lang="ts" setup>
interface Props {
  actionType: 'add' | 'edit'
  submit: (dto: CreateTagRequestDto) => Promise<void>
  remove?: () => Promise<void>
  color?: string
  name?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  actionType: 'add',
  name: '',
  color: '',
  icon: '',
})

const { object, string } = useYap()
const { t } = useI18n()
const toast = useToast()

const state = ref({ name: '' })
const color = ref('')
const icon = ref('')
const isIconPickerOpen = ref(false)
const form = ref()

const schema = object({
  name: string().required().min(2).max(20),
})

const iconToShow = computed(() => icon.value || 'heroicons:tag')

async function saveTag() {
  try {
    await form.value?.validate()
  }
  catch (e) {
    console.error(e)
    return toast.add({ title: 'Invalid form' })
  }

  await props.submit({
    name: state.value.name,
    color: color.value,
    icon: iconToShow.value,
  })
}

function setIcon(iconName: string) {
  icon.value = iconName
  isIconPickerOpen.value = false
}

onMounted(() => {
  state.value.name = props.name
  color.value = props.color
  icon.value = props.icon
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center pt-2">
    <h1 class="text-2xl font-bold  mb-8">
      {{ t(`tag.${actionType}`) }}
    </h1>

    <UForm ref="form" :schema="schema" :state="state" class="w-full pl-2 pr-2">
      <div class="mb-6 flex items-center justify-between">
        <button class="inline-flex items-center justify-center overflow-hidden rounded-full bg-(--ui-bg-elevated) size-16 text-3xl" @click="isIconPickerOpen = true">
          <UIcon :name="iconToShow" :style="{ color }" />
        </button>

        <UFormField name="name" class="w-64">
          <UInput
            v-model="state.name"
            :placeholder="t('common.name')"
            size="xl"
          />
        </UFormField>
      </div>

      <div class="mb-6">
        <UiColorPicker v-model:value="color" />
      </div>

      <UButton block size="xl" class="mt-8" @click="saveTag">
        {{ t(`common.submit`) }}
      </UButton>
    </UForm>
  </div>

  <UModal v-model:open="isIconPickerOpen">
    <template #content>
      <div class="p-4">
        <UiIconPicker :value="icon" @update:value="setIcon" />
      </div>
    </template>
  </UModal>
</template>
