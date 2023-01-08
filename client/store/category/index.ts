import {acceptHMRUpdate, defineStore} from 'pinia'
import state from '~/store/category/state'
import actions from '~/store/category/actions'
import getters from '~/store/category/getters'


export const useCategoryStore = defineStore('category', {
    state,
    actions,
    getters,
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}