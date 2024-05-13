<template>
  <div>
    <UCard>
      <template #header>
        <span>{{ $t('common.language') }}</span>
      </template>

      <USelectMenu
        v-model="locale"
        :options="langList"
        value-attribute="locale"
        option-attribute="label"
      >
        <template #label>
          {{ selected.label }}
        </template>
      </USelectMenu>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n()
const router = useRouter()
const cookieLocale = useCookie('i18n')

const langList = [
  { locale: 'en', label: 'English' },
  { locale: 'ru', label: 'Русский' },
]

const selected = computed(() =>
  langList.find((lang) => lang.locale === locale.value),
)

watch(locale, (value) => (cookieLocale.value = value))
</script>
