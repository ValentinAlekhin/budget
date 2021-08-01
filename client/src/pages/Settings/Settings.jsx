import React from 'react'

import {
  CategoryWrapper,
  CategorySubWrapper,
  CategoryTitle,
  CategorySubTitle,
  Category,
  CategoryInput,
  AddCategory,
} from './styled'

import PageWrapper from '../../components/PageWrapper/PageWrapper'

const Settings = () => {
  const dynamicCat = [{ title: 'Продукты' }]
  const staticCat = [{ title: 'Продукты' }]

  return (
    <PageWrapper title={'Настройки'}>
      <CategoryTitle>Траты</CategoryTitle>
      <CategoryWrapper>
        <CategorySubWrapper>
          <CategorySubTitle>Динамические</CategorySubTitle>
          {dynamicCat.map(({ title }) => (
            <Category value={title} />
          ))}
        </CategorySubWrapper>

        <CategorySubWrapper>
          <CategorySubTitle>Статические</CategorySubTitle>
          {staticCat.map(({ title }) => (
            <Category value={title} />
          ))}
        </CategorySubWrapper>
      </CategoryWrapper>
    </PageWrapper>
  )
}

export default Settings
