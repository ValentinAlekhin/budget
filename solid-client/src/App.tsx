import type { Component } from 'solid-js'
import { onMount } from 'solid-js'
import { Routes, useNavigate, useRoutes } from '@solidjs/router'
import { GlobalStyles } from './style'
import { Toaster } from 'solid-toast'
import { init, userState } from './store/user'
import { getAll } from './store/category'
import BottomBar from './components/BottomBar'
import { routes } from './router'

const App: Component = () => {
  const navigate = useNavigate()
  const Routes = useRoutes(routes)

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
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#17212b',
            color: '#fff',
          },
        }}
      />
      {userState.username && <BottomBar />}
      <Routes />
    </>
  )
}

export default App
