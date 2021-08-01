import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ColumnTitles, ColumnTitle, Row, RowText, RowInput } from './styled'

import PageWrapper from '../../components/PageWrapper/PageWrapper'

const Home = () => {
  const titles = ['Категория', 'Баланс', 'Сумма', 'Комментарий']
  const categories = useSelector(({ costs }) => costs.categories)

  return (
    <PageWrapper title={'Траты'}>
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
    </PageWrapper>
  )
}

export default Home
