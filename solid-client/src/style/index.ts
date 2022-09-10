import { createGlobalStyles } from 'solid-styled-components'

export const GlobalStyles = createGlobalStyles`
   body, html, #root {
     height: 100%;
     background: #0e1621;
     color: #fff;
    }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  li {
    list-style: none;
  }
`
