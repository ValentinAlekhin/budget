<template>
  <div>
    <a-input
      :id="props.id"
      :value="computedValue"
      :suffix="props.suffix"
      @input="$emit('inpput', $event)"
      @focus="isFocus = true"
      @focusout="isFocus = false"
    >
      <template #prefix>
        <div class="prefix">
          <span class="name">{{ props.name }}</span>
          <span class="balance">{{ props.balance }}</span>
        </div>
      </template>
    </a-input>

    <div v-if="isFocus" class="math-helpers">
      <a-button
        v-for="mathHelper of mathHelpers"
        :key="mathHelper"
        @click="$emit('ser')"
      >
        {{ mathHelper }}
      </a-button>
    </div>

    <a-input
      v-if="showComment"
      :value="props.comment"
      placeholder="Комментарий"
      @input="$emit"
    />
  </div>
</template>

<script setup lang="ts">
import { Parser } from 'expr-eval'

const parser = new Parser()
const evaluate = (str: string, scope: Record<string, number> = {}) => {
  if (!str) return ''

  try {
    return parser.evaluate(str, scope)
  } catch (e) {
    return 'Ошибка выражения'
  }
}

const props = defineProps([
  'id',
  'suffix',
  'isFocused',
  'name',
  'balance',
  'comment',
  'value',
  'scope',
])

defineEmits(['update:value', 'update:comment'])

const localValue = ref<string>(props.value)
const isFocus = ref<boolean>(false)

const calculatedValue = computed(() => evaluate(localValue.value, props.scope))
const computedValue = computed(() =>
  isFocus.value ? localValue : calculatedValue
)
const showComment = computed(() => props.comment)

const mathHelpers = ['/', '*', '+', '-', '(', ')']
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

.math-helpers {
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss">
div.cost {
  span.ant-input-group {
    span.ant-input-group-addon {
      width: 120px;
      overflow: hidden;
    }
  }
}
</style>
