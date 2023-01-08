<template>
  <div class='auth'>
    <ElTabs v-model='activeName'>
      <ElTabPane label='Логин' name='login'><auth-login-form/></ElTabPane>
      <ElTabPane label='Регистрация' name='register'><auth-register-form/></ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang='ts'>
import {ElTabs, ElTabPane} from 'element-plus'

const activeName = ref('login')
</script>

<style lang='scss' scoped>
.auth {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
