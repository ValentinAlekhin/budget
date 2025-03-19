<script lang="ts" setup>
const { locale } = useI18n()
const cookieLocale = useCookie('i18n')

const langList = [
  { locale: 'en', label: 'English' },
  { locale: 'ru', label: 'Русский' },
]

watch(locale, value => (cookieLocale.value = value as string))
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <span>{{ $t("common.language") }}</span>
      </template>

      <USelect
        v-model="locale"
        :items="langList"
        value-key="locale"
        label-key="label"
        class="w-full"
        size="xl"
      />
    </UCard>
  </div>
</template>
