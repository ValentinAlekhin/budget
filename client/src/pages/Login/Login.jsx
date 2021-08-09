import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ImpulseSpinner } from '../../UI/Spiner/Spiner'

import { Wrapper, IdInput, SubmitButton } from './styled'
import { login } from '../../store/modules/user'

const Login = () => {
  const dispatch = useDispatch()
  
  const [id, setId] = useState('6106f69884f69917f445165e')
  
  const loading = useSelector(state => state.user.loading)
  
  return (<Wrapper>
    <IdInput value={id} onChange={e => setId(e.target.value)} placeholder="Введи свой id"/>
    <SubmitButton onClick={() => dispatch(login(id))}>
      {loading
        ? <ImpulseSpinner backColor={'#393E46'} frontColor={'#EEE'} />
        : <span>Войти</span>
      }
    </SubmitButton>
    
  </Wrapper>)
}

export default Login