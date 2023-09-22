<template>
  <div
    class="bg-background/75 fixed top-0 z-50 -mb-px w-full border-b border-gray-200 backdrop-blur dark:border-gray-800"
  >
    <header
      class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2"
    >
      <div class="flex items-center">
        <div id="headerTeleport" />
      </div>

      <div class="flex w-28 items-center justify-between">
        <header-connection />

        <ui-theme-switch />

        <header-dropdown />
      </div>
    </header>
  </div>
</template>
