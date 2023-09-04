<template>
  <button
    :class="[$style.button, { [$style.pressed]: pressed }]"
    :aria-label="props.text"
    @click="onClick"
  >
    <span v-if="props.text">{{ props.text }}</span>

    <slot v-else />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  text: { type: String, default: "" },
});

const emit = defineEmits(["click"]);

const pressed = ref<boolean>(false);

const onClick = (event) => {
  emit("click", { event, props });

  pressed.value = true;

  const interval = setInterval(() => {
    pressed.value = false;
    clearInterval(interval);
  }, 200);
};
</script>

<style lang="scss" scoped module>
.button {
  color: rgba(0, 0, 0, 0.7);
  font-weight: 300;
  font-size: 20px;
  border: none;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease-out 0.1s;
}

.pressed {
  background: lighten(#000, 70);
}
</style>
