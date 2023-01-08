<template>
  <ElForm ref='formRef' :model='formValue' :rules='rules' :disabled='loading'>
    <ElFormItem prop='username'>
      <ElInput v-model='formValue.username' size='large' placeholder='Логин' :prefix-icon='UserFilled' />
    </ElFormItem>

    <ElFormItem prop='email'>
      <ElInput v-model='formValue.email' type='email' size='large' placeholder='Почта' :prefix-icon='Message' />
    </ElFormItem>

    <ElFormItem prop='password'>
      <ElInput v-model='formValue.password' type='password' size='large' placeholder='Пароль' :prefix-icon='Lock' />
    </ElFormItem>

    <ElFormItem>
      <ElButton type='primary' size='large' @click='submitForm(formRef)'>Зарегестироваться</ElButton>
    </ElFormItem>
  </ElForm>
</template>

<script lang='ts' setup>
import { ElButton, ElForm, FormInstance, FormRules, ElFormItem, ElInput } from 'element-plus'
import { UserFilled, Lock, Message } from '@element-plus/icons-vue'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

const formRef = ref<FormInstance>()

const formValue = reactive({
  username: '',
  password: '',
  email: '',
})

const rules = reactive<FormRules>({
  username: [{ required: true, message: 'Required' }],
  password: [{ required: true, message: 'Required' }],
  email: [{ required: true, message: 'Required' }],
})

let loading = ref<Boolean>(false)
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  loading.value = true
  try {
    await authStore.register(formValue)
  } catch(e) {
  } finally {
    loading.value = false
  }
}
</script>
