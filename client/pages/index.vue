<template>
  <Nuxt-Link to='/auth'>/auth</Nuxt-Link>

  <ElTabs tab-position='bottom'>
    <ElTabPane v-for='tab of links' :key='tab.name' :name='tab.to' :label='tab.name'/>
  </ElTabs>
</template>

<script setup lang='ts'>
import {ElTabs, ElTabPane} from 'element-plus'

const links = [
  { name: 'Траты', to: '/' },
  { name: 'Распред', to: '/dist' },
  { name: 'БД', to: '/db' },
  { name: 'Статистика', to: '/stat' },
]
</script>