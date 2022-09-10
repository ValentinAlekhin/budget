import { createStore } from 'solid-js/store'
import { axios } from '../../api'

interface CategoryItem {
  id: number
  name: string
  type: string
  comment: string
}

interface CategoryStore {
  items: CategoryItem[]
  loading: boolean
  error: boolean
}

const [categoryStore, setStore] = createStore<CategoryStore>({
  items: [],
  loading: false,
  error: false,
})

export const getAll = async () => {
  setStore('error', false)
  setStore('loading', true)

  try {
    const { data } = await axios.get<CategoryItem[]>('/category')

    setStore('items', data)
  } catch (e) {
    setStore('error', true)
  } finally {
    setStore('loading', false)
  }
}

export { categoryStore }
