<template>
  <div>
    <template v-for="(inp, i) of computedInputs" :key="inp.id">
      <UInput
        :id="inp.id"
        :value="inp.inputValue"
        size="md"
        :ui="{ leading: { padding: { md: 'ps-40' } } }"
        class="mb-2"
        @input="inp.setValue"
        @focus="focusedId = inp.id"
      >
        <template #leading>
          <div
            class="text-gray-500 dark:text-gray-400 flex justify-between items-center w-36"
          >
            <span>{{ inp.name }}</span>
            <span :class="inp.colorClass">{{ inp.formattedBalance }}</span>
          </div>
        </template>

        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">
            {{ i + 1 }}
          </span>
        </template>
      </UInput>

      <div v-if="inp.focused" class="math-helpers">
        <UButton
          v-for="mathHelper of []"
          :key="mathHelper"
          @click="inp.addHelper(mathHelper)"
        >
          {{ mathHelper }}
        </UButton>
      </div>

      <UInput
        v-if="inp.showCommentInp"
        :value="inp.comment"
        placeholder="Комментарий"
        class="mb-2"
        size="md"
        @input="inp.setComment"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Parser } from "expr-eval";
import dayjs from "dayjs";
import { get, set } from "lodash-es";
import { useRecordStore } from "~/store/record";
import { doGetCaretPosition, setCaretPosition } from "~/utils";
import { useCategoriesWithBalance } from "~/hooks/useCategoriesWithBalance";
import { useActionsStore } from "~/store/actions";

const parser = new Parser();

const actionsStore = useActionsStore();
const recordStore = useRecordStore();
const router = useRouter();
const toast = useToast();

const { categoriesWithBalance } = useCategoriesWithBalance();

const pushToSettings = () => router.push({ path: "/edit" });

const evaluate = (str: string, scope: Record<string, number>) => {
  if (!str) return "";

  try {
    return parser.evaluate(str, scope);
  } catch (e) {
    return "Ошибка выражения";
  }
};

const focusedId = ref<string | null>(null);
const formState = reactive<Record<string, { value: string; comment: string }>>(
  {}
);
const computedInputs = computed(() =>
  categoriesWithBalance.value.map(
    ({ id, name, balance, formattedBalance, colorClass }) => {
      const scope = {
        $1: 100,
      };
      const valuePath = `${id}.value`;
      const commentPath = `${id}.comment`;
      const value = get(formState, valuePath, "");
      const comment = get(formState, commentPath, "");
      const evaluatedValue = evaluate(value, scope);
      const focused = focusedId.value === id;
      const valid = evaluatedValue !== "Ошибка выражения";

      return {
        id,
        name,
        balance,
        formattedBalance,
        colorClass,
        showCommentInp: !!value,
        comment,
        value,
        evaluatedValue,
        focused,
        valid,
        inputValue: focused ? value : evaluatedValue,
        setValue: (e) => set(formState, valuePath, e.target.value),
        setComment: (e) => set(formState, commentPath, e.target.value),
        addHelper: (helper: string) => {
          const inputEl = document.getElementById(id);
          const pos = doGetCaretPosition(inputEl);
          const arr = value.split("");
          arr.splice(pos, 0, helper);
          set(formState, valuePath, arr.join(""));
          setCaretPosition(inputEl, pos);
        },
      };
    }
  )
);

const formHasAnyValue = computed(
  () => !!Object.values(formState).find((item) => item.value)
);

const formValid = computed(
  () =>
    !computedInputs.value.find((inp) => !inp.valid) &&
    computedInputs.value.find((inp) => inp.value)
);

const resetForm = () =>
  computedInputs.value.forEach(({ id }) =>
    set(formState, id, { comment: "", value: "" })
  );

const save = async () => {
  if (!formValid.value) return toast.add({ title: "Invalid form values" });

  const payload = computedInputs.value
    .filter((inp) => inp.value)
    .map(({ evaluatedValue, id, comment }) => ({
      amount: evaluatedValue,
      category: id,
      timestamp: dayjs().toISOString(),
      comment,
      type: "cost",
    }));

  await recordStore.addRecords(payload);

  resetForm();
};

watch(formHasAnyValue, (value) => {
  if (value) {
    actionsStore.setActions({
      submit: save,
      cancel: resetForm,
      edit: pushToSettings,
    });
  } else {
    actionsStore.setActions({
      edit: pushToSettings,
    });
  }
});

onMounted(() =>
  actionsStore.setActions({
    edit: pushToSettings,
  })
);
</script>
