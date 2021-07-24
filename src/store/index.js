import { configureStore } from '@reduxjs/toolkit'

import costs from './modules/costs'

export default configureStore({
  reducer: { costs },
})
