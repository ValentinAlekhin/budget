import { configureStore } from '@reduxjs/toolkit'

import user from './modules/user'
import costs from './modules/costs'

export default configureStore({
  reducer: { costs, user },
})
