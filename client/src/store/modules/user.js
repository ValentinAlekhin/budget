import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import history from '../../utils/history'

export const login = createAsyncThunk('user/login', async id => {
  axios.defaults.headers = {
    'Authorization': `Bearer ${id}`
  }
  const response = await axios.get('/api')
  
  return response.data
})

export const initUser = createAsyncThunk('user/init', async () => {})

const costs = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    }
  },
  extraReducers: {
    [login.fulfilled](state, { payload }) {
      localStorage.setItem('_id', payload._id)
      
      state.loading = false
      state.user = payload
      
      history.push('/')
    },
    [login.pending](state, action) {
      state.loading = true
    },
    [login.rejected](state, action) {
      state.loading = false
      state.error = 'Ошибка'
    },
  }
})

export const { setCategories } = costs.actions

export default costs.reducer
