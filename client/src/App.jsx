import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import history from './utils/history'

import GlobalStyle from './styles/GlobalStyles'

import Footer from './components/Footer/Footer'

import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Settings from './pages/Settings/Settings'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

const App = () => {
  const user = useSelector(state => state.user.user)
  
  return (
    <Router history={history}>
      <GlobalStyle />
      <main className="App">
        <Switch>
          <Route path="/login" component={Login}/>
          <PrivateRoute path="/" component={Home} auth={user} exact />
          <PrivateRoute path="/settings" component={Settings} auth={user} exact />
        </Switch>
        { user ? <Footer/> : null }
      </main>
    </Router>
  )
}

export default App
