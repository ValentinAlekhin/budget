import { css } from 'styled-components'

const fonts = css`
  /* roboto-100 - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 100;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-300 - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-100italic - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 100;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100italic.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100italic.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100italic.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100italic.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100italic.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-100italic.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-300italic - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 300;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300italic.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300italic.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300italic.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300italic.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300italic.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-300italic.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-regular - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-regular.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-regular.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-regular.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-regular.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-regular.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-regular.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-italic - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 400;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-italic.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-italic.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-italic.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-italic.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-italic.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-italic.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-500 - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-500italic - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 500;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500italic.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500italic.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500italic.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500italic.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500italic.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-500italic.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-700 - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-700italic - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 700;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700italic.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700italic.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700italic.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700italic.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700italic.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-700italic.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-900 - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
  /* roboto-900italic - latin-ext_latin_cyrillic-ext_cyrillic */
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 900;
    src: url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900italic.eot'); /* IE9 Compat Modes */
    src: local(''),
      url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900italic.eot?#iefix')
        format('embedded-opentype'),
      /* IE6-IE8 */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900italic.woff2')
        format('woff2'),
      /* Super Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900italic.woff')
        format('woff'),
      /* Modern Browsers */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900italic.ttf')
        format('truetype'),
      /* Safari, Android, iOS */
        url('/fonts/roboto/roboto-v27-latin-ext_latin_cyrillic-ext_cyrillic-900italic.svg#Roboto')
        format('svg'); /* Legacy iOS */
  }
`

export default fonts
