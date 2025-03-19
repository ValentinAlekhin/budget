<script lang="ts" setup>
import dayjs from 'dayjs'
import { Parser } from 'expr-eval'
import { cloneDeep, get, set } from 'lodash-es'

interface Props {
  value: Record<string, { value: string, comment: string }>
  type: 'cost' | 'inc'
  list: any[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const parser = new Parser()

const { recordStore } = useRecordStore()
const toast = useToast()
const router = useRouter()
const actionsStore = useActionsStore()

function setState(path: string) {
  return (e) => {
    const newState = cloneDeep(props.value)
    set(newState, path, e.target.value)
    emit('update:value', newState)
  }
}

function evaluate(str: string, scope: Record<string, number>) {
  if (!str)
    return ''

  try {
    return parser.evaluate(str, scope)
  }
  catch (e) {
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
  () => !!Object.values(props.value).find(item => item.value),
)

const formValid = computed(
  () =>
    !computedInputs.value.find(inp => !inp.valid)
    && computedInputs.value.find(inp => inp.value),
)
function resetForm() {
  const newState = cloneDeep(props.value)
  computedInputs.value.forEach(({ id }) =>
    set(newState, id, { comment: '', value: '' }),
  )
  emit('update:value', newState)
}

async function save() {
  if (!formValid.value)
    return toast.add({ title: 'Invalid form values' })

  const payload = computedInputs.value
    .filter(inp => inp.value)
    .map(({ evaluatedValue, id, comment }) => ({
      amount: evaluatedValue,
      categoryId: id,
      timestamp: dayjs().toISOString(),
      comment,
    }))

  await recordStore.addRecords(payload)

  resetForm()
}

const pushToSettings = () => navigateTo('/edit')

function setActions(value) {
  if (value) {
    actionsStore.setActions({
      submit: save,
      cancel: resetForm,
      edit: pushToSettings,
    })
  }
  else {
    actionsStore.setActions({
      edit: pushToSettings,
    })
  }
}

watch(formHasAnyValue, setActions)

onMounted(() => setActions(formHasAnyValue.value))
</script>

<template>
  <ul v-auto-animate>
    <template v-for="(inp, i) of computedInputs" :key="inp.id">
      <UInput
        :id="String(inp.id)"
        :model-value="inp.inputValue"
        :placeholder="inp.icon ? inp.name : ''"
        size="xl"
        :ui="{ leading: 'pl-4', base: 'pl-36' }"
        class="block mb-2"
        @input="inp.setValue"
        @focus="focusedId = inp.id"
      >
        <template #leading>
          <div
            class="flex items-center justify-between text-gray-500 dark:text-gray-400"
            :class="inp.leadingClass"
          >
            <UIcon
              v-if="inp.icon"
              :name="inp.icon"
              size="28"
            />
            <span
              v-else
              class="w-20 truncate"
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
        class="mb-2 w-full"
        size="xl"
        @input="inp.setComment"
      />
    </template>
  </ul>
</template>
