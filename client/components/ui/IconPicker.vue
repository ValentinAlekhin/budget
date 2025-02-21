<!-- components/IconPicker.vue -->
<script lang="ts" setup>
import { debounce } from 'lodash-es'

interface Props {
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const searchQuery = ref('')
const icons = ref([])
const loading = ref(false)

async function searchIcons() {
  if (!searchQuery.value.trim()) {
    icons.value = []
    return
  }

  loading.value = true
  try {
    const response = await $fetch(
      `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery.value)}&limit=40`,
    )
    icons.value = response.icons.map(iconName => ({
      name: iconName,
    }))
  }
  catch (error) {
    console.error('Ошибка при загрузке иконок:', error)
    icons.value = []
  }
  finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(searchIcons, 300)

function selectIcon(iconName) {
  if (iconName === props.value) {
    return emit('update:value', '')
  }

  emit('update:value', iconName)
}

onMounted(() => {
  searchQuery.value = props.value
  searchIcons()
})
</script>

<template>
  <div class="w-full p-4">
    <UInput
      v-model="searchQuery"
      placeholder="Поиск иконок (например, mdi:home)"
      variant="outline"
      class="mb-4"
      size="xl"
      @input="debouncedSearch"
    >
      <template #trailing>
        <Icon :name="value" class="w-6 h-6" />
      </template>
    </UInput>

    <div class="h-64">
      <div
        v-if="!loading && icons.length > 0"
        class="grid grid-cols-7 gap-4 max-h-60 overflow-y-auto"
      >
        <button
          v-for="icon in icons"
          :key="icon.name"
          @click="selectIcon(icon.name)"
        >
          <Icon :name="icon.name" class="w-8 h-8" :class="{ 'text-primary': icon.name === value }" />
        </button>
      </div>

      <p v-else-if="searchQuery && !loading" class="text-gray-500 text-center">
        Иконки не найдены
      </p>

      <p v-if="loading" class="flex items-center justify-center">
        <UiLoadersPuls />
      </p>
    </div>

    <div v-if="value" class="mt-4 text-center">
      <p class="text-sm text-gray-700">
        {{ value }}
      </p>
      <Icon :icon="value" class="w-8 h-8 mx-auto mt-2" />
    </div>
  </div>
</template>
