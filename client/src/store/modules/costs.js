import { createSlice } from '@reduxjs/toolkit'

const costs = createSlice({
  name: 'costs',
  initialState: {
    categories: [
      { title: 'Продукты', balance: 10000 },
      { title: 'Транспорт', balance: 10000 },
      { title: 'Развелечения', balance: 10000 },
      { title: 'Одежда', balance: 10000 },
      { title: 'Уход', balance: 10000 },
      { title: 'Фастфуд', balance: 10000 },
    ],
  },
  reducers: {
    setCategories: (state, { payload }) => (state.categories = payload),
  },
})

export const { setCategories } = costs.actions

export default costs.reducer
