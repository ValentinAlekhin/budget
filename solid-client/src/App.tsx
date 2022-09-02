import type { Component } from 'solid-js'
import { Routes, Route, useNavigate } from '@solidjs/router'
import { GlobalStyles } from './style'

import DB from './pages/db'
import Cost from './pages/cost'
import Dist from './pages/distrib'
import Stat from './pages/stat'
import Login from './pages/Auth/login'
import { onMount } from 'solid-js'
import { init, userState } from './store/user'
import { getAll } from './store/category'
import BottomBar from './components/BottomBar'

const App: Component = () => {
  const navigate = useNavigate()

  onMount(async () => {
    await init()

    if (!userState.username) {
      return navigate('/auth/login', { replace: true })
    }

    await getAll()
  })

  return (
    <>
      <GlobalStyles />
      {userState.username && <BottomBar />}
      <Routes>
        <Route path="/" component={Cost} />
        <Route path="/db" component={DB} />
        <Route path="/dist" component={Dist} />
        <Route path="/stat" component={Stat} />
        <Route path="/auth/login" component={Login} />
      </Routes>
    </>
  )
}

export default App
