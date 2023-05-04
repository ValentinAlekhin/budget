<template>
  <div class="cost">
    <template v-for="(inp, i) of computedInputs" :key="inp.id">
      <a-input
        :id="inp.id"
        :value="inp.inputValue"
        :suffix="i + 1"
        @input="inp.setValue"
        @focus="focusedId = inp.id"
      >
        <template #prefix>
          <div class="prefix">
            <span class="name">{{ inp.name }}</span>
            <span class="balance">{{ inp.balance }}</span>
          </div>
        </template>
      </a-input>

      <div v-if="inp.focused" class="math-helpers">
        <a-button
          v-for="mathHelper of mathHelpers"
          :key="mathHelper"
          @click="inp.addHelper(mathHelper)"
        >
          {{ mathHelper }}
        </a-button>
      </div>

      <a-input
        v-if="inp.showCommentInp"
        :value="inp.comment"
        placeholder="Комментарий"
        @input="inp.setComment"
      />
    </template>

    <a-button class="m4" :disabled="!formValid" @click="save">
      Сохранить
    </a-button>

    <a-button class="m4" @click="pushToSettings">Настройки</a-button>
  </div>
</template>

<script setup lang="ts">
import { Parser } from "expr-eval";
import dayjs from "dayjs";
import { get, set } from "lodash";
import { message } from "ant-design-vue";
import { useRecordStore } from "~/store/record";
import { doGetCaretPosition, setCaretPosition } from "~/utils";
import { useCategoriesWithBalance } from "~/hooks/useCategoriesWithBalance";

const parser = new Parser();

const recordStore = useRecordStore();
const router = useRouter();

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
  categoriesWithBalance.value.map(({ id, name, balance }) => {
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
  })
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

  message.success("Записи добавлены");
};
</script>

<style lang="scss" scoped>
.cost {
}

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
