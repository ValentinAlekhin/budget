import { createSlice } from '@reduxjs/toolkit'

const costs = createSlice({
  name: 'user',
  initialState: {
    costs: {
      dynamic: [
        { title: 'Продукты', id: 1 },
        { title: 'Развлечения', id: 2 },
        { title: 'Фастфуд', id: 3 },
      ],
      static: [
        { title: 'Интернет', id: 1 },
        { title: 'Подписки', id: 2 },
        { title: 'ЖКХ', id: 3 },
      ],
    },
    income: [{ title: 'Зарплата', id: 1 }],
  },
  reducers: {
    setCost: (state, { payload }) => {
      const { key, value, id } = payload
    },
  },
})

export const { setCategories } = costs.actions

export default costs.reducer
