<template>
  <ElForm ref="formRef" :model="form" label-width="50px" label-position="left">
    <template v-for="item of categoryStore.data" :key="item.id">
      <ElFormItem :label="item.name" :prop="`${item.id}_amount`" >
        <ElInput v-model="form[`${item.id}_amount`]" placeholder="Amount"/>
      </ElFormItem>

      <ElFormItem :prop="`${item.id}_amount`">
        <ElInput v-if="form[`${item.id}_amount`]" v-model="form[`${item.id}_comment`]" placeholder="Comment"/>
      </ElFormItem>
    </template>

    <ElFormItem>
      <ElButton @click="submit">Submit</ElButton>
      <ElButton @click="resetForm(formRef)">Reset</ElButton>
    </ElFormItem>
  </ElForm>

  <div>
    <ElInput v-model="newCostName" placeholder="Name" />
    <ElButton @click="addCategory">Add</ElButton>
  </div>
</template>

<script setup lang='ts'>
import { ElInput, ElButton, ElForm, ElFormItem, FormInstance } from 'element-plus'
import {useCategoryStore} from '~/store/category'

const formRef = ref<FormInstance>()
const newCostName = ref('')

const categoryStore = useCategoryStore()

const form = reactive(categoryStore.data.reduce((acc, value) => {
  acc[`${value.id}_amount`] = ''
  acc[`${value.id}_comment`] = ''

  console.log(acc)

  return acc
}, {}))

const addCategory = async () => {
  await categoryStore.addCost({ name: newCostName.value, comment: '' })
}

const submit = async () => {
  console.log(form)
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>