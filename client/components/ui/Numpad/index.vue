<template>
  <div :class="$style.numpad">
    <div :class="$style.topRow">
      <ui-numpad-button
        v-for="helper of mathHelpers"
        :key="helper"
        :text="helper"
      />
    </div>
    <div :class="$style.numbers">
      <ui-numpad-button
        v-for="num of numbers"
        :key="num.text"
        :text="num.text"
        :style="num.style"
        @click="onNumClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const mathHelpers = ['/', '*', '+', '-', '(', ')']

const numbers = [
  ...Array(10)
    .fill('')
    .map((_, i) => ({
      text: i.toString(),
      style: { gridArea: `num_${i}` },
    })),
  { text: '<', style: { gridArea: 'remove' } },
  { text: 'ok', style: { gridArea: 'ok' } },
]

const onNumClick = (e) => {
  console.log('click', e)
}
</script>

<style lang="scss" module>
.numpad {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 500px;
  height: 40vh;
  background: #fff;
  z-index: 100;
  padding: 10px;
  display: grid;
  grid-template-rows: 30px 1fr;
  grid-gap: 10px;
}

.topRow {
  display: grid;
  grid-template-columns: repeat(6, 40px);
  grid-template-rows: 1fr;
  grid-gap: 20px;
  justify-content: center;
}

.numbers {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-template-areas: 'num_1 num_2 num_3' 'num_4 num_5 num_6' 'num_7 num_8 num_9' 'ok num_0 remove';
}
</style>
