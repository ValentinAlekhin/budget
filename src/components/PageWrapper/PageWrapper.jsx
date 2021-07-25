import React from 'react'

import Container from '../Container/Container'

import { Wrapper, Title } from './styled'

const PageWrapper = ({ children, title }) => {
  return (
    <Container>
      <Wrapper>
        <Title>{title}</Title>
        {children}
      </Wrapper>
    </Container>
  )
}

export default PageWrapper
