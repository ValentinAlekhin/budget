import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('infinite-loading', InfiniteLoading)
})
