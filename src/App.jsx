import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import GlobalStyle from './styles/GlobalStyles'

import Footer from './components/Footer/Footer'

import Home from './pages/Home/Home'

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <main className="App">
        <Switch>
          <Route path="/" component={Home} exact />
        </Switch>
        <Footer />
      </main>
    </Router>
  )
}

export default App
