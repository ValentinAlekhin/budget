<template>
  <div class="pb-40">
    <ClientOnly>
      <MobileOnly>
        <Teleport to="#headerTeleport">
          <BackButton class="mr-2" to="/" />
        </Teleport>
      </MobileOnly>
    </ClientOnly>

    <Draggable
      v-model="computedInputs"
      class="list-group"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      item-key="id"
      handle=".handle"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{ element }">
        <div class="grid grid-cols-3 gap-1 items-center mb-2 inputContainer">
          <UButton
            size="sm"
            color="rose"
            icon="i-heroicons-trash"
            :ui="{ rounded: 'rounded-full' }"
            variant="ghost"
            @click="itemToDelete = element"
          />

          <div class="grid grid-cols-2 gap-2 w-[75vw]">
            <UInput size="md" :value="element.name" @input="element.setName" />

            <UInput size="md" :value="element.icon" @input="element.setIcon">
              <template v-if="element.icon" #trailing>
                <Icon :name="element.icon" size="24" />
              </template>
            </UInput>
          </div>

          <UButton
            class="handle"
            size="sm"
            :ui="{ rounded: 'rounded-full' }"
            icon="i-heroicons-arrows-up-down"
            variant="ghost"
          />
        </div>
      </template>
    </Draggable>

    <UModal v-model="addModal">
      <UCard>
        <template #header>
          <span class="dark:text-white font-medium text-xl">
            Add new category
          </span>
        </template>

        <UForm ref="form" :schema="schema" :state="state">
          <UFormGroup label="Name" name="name" class="mb-2">
            <UInput v-model="state.name" />
          </UFormGroup>

          <UFormGroup label="Icon" name="icon">
            <UInput v-model="state.icon" class="mb-1">
              <template v-if="state.icon" #trailing>
                <Icon :name="state.icon" size="24" />
              </template>
            </UInput>

            <span class="text-sm text-neutral-400"
              >Search icons
              <a
                href="https://icon-sets.iconify.design/"
                target="_blank"
                class="text-cyan-500 underline"
                >here</a
              >
            </span>
          </UFormGroup>
        </UForm>

        <template #footer>
          <UButton block @click="saveNew"> Add </UButton>
        </template>
      </UCard>
    </UModal>

    <common-modal-remove
      :is-open="!!itemToDelete"
      :title="`Remove category '${itemToDelete?.name}'?`"
      @close="itemToDelete = null"
      @remove="removeItem(itemToDelete?.id)"
    />
  </div>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import { storeToRefs } from "pinia";
import { object, string } from "yup";
import { get, last } from "lodash-es";
import { set } from "vue-demi";
import { useCategoryStore } from "~/store/category";
import { useActionsStore } from "~/store/actions";
import BackButton from "~/components/ui/BackButton.vue";
import MobileOnly from "~/components/ui/MobileOnly.vue";

const actionsStore = useActionsStore();
const categoryStore = useCategoryStore();
const toast = useToast();
const { costs } = storeToRefs(categoryStore);
const router = useRouter();

const formState = reactive<
  Record<string, { name: string; order: number; icon?: string }>
>(
  costs.value.reduce((acc, c, i) => {
    acc[c.id] = { order: i + 1, name: c.name, icon: c.icon };

    return acc;
  }, {})
);
const drag = ref<boolean>(false);
const addModal = ref<boolean>(false);
const itemToDelete = ref<any>(null);

const schema = object({
  name: string().required("Category name required").min(4),
  icon: string(),
});

const state = ref({
  name: "",
  icon: "",
});

const form = ref();

const dragOptions = {
  animation: 150,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
};

watch(
  costs,
  (value) =>
    value.forEach(
      (c, i) => (formState[c.id] = { order: i + 1, name: c.name, icon: c.icon })
    ),
  {
    deep: true,
  }
);

const computedInputs = computed({
  get: () =>
    costs.value
      .map(({ id }, i) => {
        const namePath = `${id}.name`;
        const orderPath = `${id}.order`;
        const iconPath = `${id}.icon`;
        const name = get(formState, namePath, "");
        const order = get(formState, orderPath, i + 1);
        const icon = get(formState, iconPath, "");

        return {
          id,
          name,
          order,
          icon,
          setName: (e) => set(formState, namePath, e.target.value),
          setOrder: (order) => set(formState, orderPath, order),
          setIcon: (e) => set(formState, iconPath, e.target.value),
        };
      })
      .sort((a, b) => a.order - b.order),
  set: (value) => value.forEach((item, i) => item.setOrder(i + 1)),
});

const save = async () => {
  const payload = computedInputs.value.map(({ id, order, name, icon }) => ({
    id,
    order,
    name,
    icon,
    type: "cost",
  }));

  await categoryStore.updateMany(payload);

  await router.push("/");
};

const saveNew = async () => {
  try {
    await form.value?.validate();
  } catch (e) {
    toast.add({ title: "Invalid category name" });
  }

  const payload = {
    name: state.value.name,
    icon: state.value.icon,
    type: "cost",
    order: (last(categoryStore.costs)?.order || 0) + 1,
  };

  await categoryStore.addCategory(payload);
  addModal.value = false;
};

const removeItem = async (id: string) => {
  await categoryStore.delete(id);
  itemToDelete.value = null;
};

onMounted(() =>
  actionsStore.setActions({
    add: () => (addModal.value = true),
    submit: save,
    cancel: () => router.push("/"),
  })
);
</script>

<style lang="scss" scoped>
.inputContainer {
  grid-template-columns: 30px 1fr 30px;
}
</style>
