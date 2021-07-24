import { createGlobalStyle } from 'styled-components'

import fonts from './fonts'

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100%;
  }

  body {
    font-family: 'Roboto', 'Manrope', 'Times New Roman', Times, sans-serif;
  }

  ul {
    list-style: none;
  }
  
  a {
    text-decoration: none;
    color: #000;
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
  }

  ${fonts}
`

export default GlobalStyle
