import { defineStore } from 'pinia'

interface State {
  edit?: null | Function
  submit?: null | Function
  cancel?: null | Function
  add?: null | Function
}

export const useActionsStore = defineStore('actions', {
  state: () =>
    ({
      edit: null,
      submit: null,
      cancel: null,
      add: null,
    }) as State,
  actions: {
    setActions(actions: State, reset = true) {
      if (reset)
        this.$reset()

      this.submit = actions.submit
      this.edit = actions.edit
      this.cancel = actions.cancel
      this.add = actions.add
    },
  },
  getters: {},
})
