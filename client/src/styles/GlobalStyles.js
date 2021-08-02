import { createGlobalStyle } from 'styled-components'
import { rgba } from 'polished'

import fonts from './fonts'

const fontColor = rgba('#fff', 0.7)

const GlobalStyle = createGlobalStyle`
  html, body, #root, .App {
    height: 100%;
  }

  body {
    font-family: 'Roboto', 'Manrope', 'Times New Roman', Times, sans-serif;
    background-color: #7f5a83;
    background-image: linear-gradient(315deg, #7f5a83 0%, #0d324d 74%);
    color: ${fontColor};

  }

  ul {
    list-style: none;
  }
  
  a {
    text-decoration: none;
    color: ${fontColor};
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
