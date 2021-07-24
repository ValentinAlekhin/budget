import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  Wrapper,
  Title,
  ColumnTitles,
  ColumnTitle,
  Row,
  RowText,
  RowInput,
} from './styled'

import Container from '../../components/Container/Container'

const Home = () => {
  const titles = ['Категория', 'Баланс', 'Сумма', 'Комментарий']
  const categories = useSelector(({ costs }) => costs.categories)

  return (
    <Container>
      <Wrapper>
        <Title>Траты</Title>
        <ColumnTitles>
          {titles.map(title => (
            <ColumnTitle key={title}>{title}</ColumnTitle>
          ))}
        </ColumnTitles>
        {categories.map(({ title, balance }) => (
          <Row key={title}>
            <RowText title={1}>{title}</RowText>
            <RowText>{balance}</RowText>
            <RowInput type="number" />
            <RowInput type="text" />
          </Row>
        ))}
      </Wrapper>
    </Container>
  )
}

export default Home
