import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import GlobalStyle from './styles/GlobalStyles'

import Footer from './components/Footer/Footer'

import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Settings from './pages/Settings/Settings'

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <main className="App">
        <Switch>
          <Route path="/login" component={Login} exact/>
          <Route path="/" component={Home} exact />
          <Route path="/settings" component={Settings} exact />
        </Switch>
        <Footer />
      </main>
    </Router>
  )
}

export default App
