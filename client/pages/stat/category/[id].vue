<template>
  <span>Категория {{ route.params.id }}</span>
</template>

<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router";
import dayjs from "dayjs";

const route = useRoute();

const year = useRouteQuery("year", dayjs().year().toString(), {
  transform: Number,
});
</script>
