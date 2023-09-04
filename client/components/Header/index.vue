<template>
  <div
    class="bg-background/75 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mb-px fixed w-full top-0 z-50"
  >
    <header
      class="py-2 px-2 flex flex-wrap justify-between items-center mx-auto max-w-screen-xl"
    >
      <div class="flex items-center">
        <div id="headerTeleport" />

        <span
          class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
        >
          Budget
        </span>
      </div>

      <nav class="border-gray-200 px-6">
        <div class="hidden justify-between items-center lg:flex">
          <ul class="flex font-medium flex-row space-x-8">
            <li v-for="link of links" :key="link.to">
              <nuxt-link
                :to="link.to"
                class="block pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
              >
                {{ link.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </nav>

      <div class="flex justify-between items-center w-20">
        <ui-theme-switch />

        <header-dropdown />
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import { useMainLinks } from "~/hooks/useMainLinks";

const { links } = useMainLinks();
</script>
