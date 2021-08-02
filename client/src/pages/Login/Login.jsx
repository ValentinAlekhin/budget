import React from 'react'
import { useDispatch } from 'react-redux'

import { Wrapper, IdInput, SubmitButton } from './styled'

const Login = () => {
  return (<Wrapper>
    <IdInput placeholder="Введи свой id"/>
    <SubmitButton>Войти</SubmitButton>
  </Wrapper>)
}

export default Login