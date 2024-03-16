<template>
  <div v-auto-animate>
    <template v-for="(inp, i) of computedInputs" :key="inp.id">
      <UInput
        :id="inp.id"
        :model-value="inp.inputValue"
        :placeholder="inp.icon ? inp.name : ''"
        size="md"
        :ui="{ leading: { padding: { md: inp.padding } } }"
        class="mb-2"
        @input="inp.setValue"
        @focus="focusedId = inp.id"
      >
        <template #leading>
          <div
            class="flex items-center justify-between text-gray-500 dark:text-gray-400"
            :class="inp.leadingClass"
          >
            <Icon
              v-if="inp.icon"
              :name="inp.icon"
              size="28"
              :class="{ 'text-cyan-400': inp.focused }"
            />
            <span
              v-else
              class="w-20 truncate"
              :class="{ 'text-cyan-400': inp.focused }"
            >
              {{ inp.name }}
            </span>
            <span v-if="inp.formattedBalance" :class="inp.colorClass">
              {{ inp.formattedBalance }}
            </span>
          </div>
        </template>

        <template #trailing>
          <span
            class="text-xs text-gray-500 dark:text-gray-400"
            :style="{ color: inp.color }"
          >
            {{ i + 1 }}
          </span>
        </template>
      </UInput>

      <UInput
        v-if="inp.showCommentInp"
        :model-value="inp.comment"
        placeholder="Комментарий"
        class="mb-2"
        size="md"
        @input="inp.setComment"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, get, set } from 'lodash-es'
import { useCategoriesWithBalance } from '~/composables/useCategoriesWithBalance'
import { Parser } from 'expr-eval'
import dayjs from 'dayjs'
import { useRecordStore } from '~/store/record'
import { useActionsStore } from '~/store/actions'

const parser = new Parser()

const { recordStore } = useRecordStore()
const toast = useToast()
const router = useRouter()
const actionsStore = useActionsStore()

interface Props {
  value: Record<string, { value: string; comment: string }>
  type: 'cost' | 'inc'
  list: any[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const setState = (path: string) => (e) => {
  const newState = cloneDeep(props.value)
  set(newState, path, e.target.value)
  emit('update:value', newState)
}

const evaluate = (str: string, scope: Record<string, number>) => {
  if (!str) return ''

  try {
    return parser.evaluate(str, scope)
  } catch (e) {
    return 'Ошибка выражения'
  }
}

const focusedId = ref<string | null>(null)

const computedInputs = computed(() =>
  props.list.map(
    ({ id, name, balance, formattedBalance, colorClass, icon, color }) => {
      const scope = {
        $1: 100,
      }
      const valuePath = `${id}.value`
      const commentPath = `${id}.comment`
      const value = get(props.value, valuePath, '')
      const comment = get(props.value, commentPath, '')
      const evaluatedValue = evaluate(value, scope)
      const focused = focusedId.value === id
      const valid = evaluatedValue !== 'Ошибка выражения'

      return {
        id,
        name,
        balance,
        formattedBalance,
        colorClass,
        showCommentInp: !!value,
        comment,
        icon,
        value,
        evaluatedValue,
        focused,
        valid,
        color,
        leadingClass: icon ? 'w-24' : 'w-36',
        padding: icon ? 'ps-32' : 'ps-40',
        inputValue: focused ? value : evaluatedValue,
        setValue: setState(valuePath),
        setComment: setState(commentPath),
      }
    },
  ),
)

const formHasAnyValue = computed(
  () => !!Object.values(props.value).find((item) => item.value),
)

const formValid = computed(
  () =>
    !computedInputs.value.find((inp) => !inp.valid) &&
    computedInputs.value.find((inp) => inp.value),
)
const resetForm = () => {
  const newState = cloneDeep(props.value)
  computedInputs.value.forEach(({ id }) =>
    set(newState, id, { comment: '', value: '' }),
  )
  emit('update:value', newState)
}

const save = async () => {
  if (!formValid.value) return toast.add({ title: 'Invalid form values' })

  const payload = computedInputs.value
    .filter((inp) => inp.value)
    .map(({ evaluatedValue, id, comment }) => ({
      amount: evaluatedValue,
      categoryId: id,
      timestamp: dayjs().toISOString(),
      comment,
    }))

  await recordStore.addRecords(payload)

  resetForm()
}

const pushToSettings = () => router.push({ path: '/edit' })

const setActions = (value) => {
  if (value) {
    actionsStore.setActions({
      submit: save,
      cancel: resetForm,
      edit: pushToSettings,
    })
  } else {
    actionsStore.setActions({
      edit: pushToSettings,
    })
  }
}

watch(formHasAnyValue, setActions)

onMounted(() => setActions(formHasAnyValue.value))
</script>
