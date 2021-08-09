import { createGlobalStyle } from 'styled-components'

import fonts from './fonts'

const GlobalStyle = createGlobalStyle`
  html, body, #root, .App {
    height: 100%;
  }

  body {
    font-family: 'Roboto', 'Manrope', 'Times New Roman', Times, sans-serif;
    background-color: #222831;
    color: #EEEEEE;

  }

  ul {
    list-style: none;
  }
  
  a {
    text-decoration: none;
    color: #EEEEEE;
  }

  input {
    border: none;
    outline: none;
    background: none;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #EEEEEE;
  }

  ${fonts}
`

export default GlobalStyle
