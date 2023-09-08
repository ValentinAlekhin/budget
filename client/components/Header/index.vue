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

      <div class="flex justify-between items-center w-20">
        <ui-theme-switch />

        <header-dropdown />
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup></script>
