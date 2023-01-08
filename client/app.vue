<template>
  <ElContainer>
    <ElHeader>Header</ElHeader>

    <ElMain>
      <NuxtPage/>
    </ElMain>

    <Footer/>
  </ElContainer>
</template>

<script setup lang='ts'>
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ID_INJECTION_KEY, ElContainer, ElMain, ElHeader } from 'element-plus'
import {useAuthStore} from '~/store/auth'
import {useCategoryStore} from '~/store/category'

const authStore = useAuthStore()
const categoryStore = useCategoryStore()

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})

onMounted(async () => {
  console.log('work')
  console.log(authStore.isLogin)

  if (!authStore.isLogin) return


  await Promise.all([
      authStore.getMe(),
      categoryStore.fetchAll(),
  ])
})

</script>