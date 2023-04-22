<template>
  <div class="list">
      <a-input v-for="(inp, i) of props.items"
        :id="inp.id"
        :value="getValue(inp.id)"
        :suffix="i + 1"
               type="number"
        @input="setValue($event, inp.id)"
      >
          <template #prefix>
              <div class="prefix">
                  <span class="name">{{ inp.name }}</span>
                  <span v-if="inp.balance" class="balance">{{ inp.balance }}</span>
              </div>
          </template>
      </a-input>
  </div>
</template>


<script lang="ts" setup>
const props = defineProps(['modelValue', 'items'])

const emit = defineEmits(['update:modelValue'])

const getValue = (id) => props?.modelValue[id]

const setValue = (e, id: string) => {
    emit('update:modelValue', { id, value:  +e.target.value  })
}

</script>

<style lang="scss" scoped>
.prefix {
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance {
  margin-right: 4px;
}
</style>