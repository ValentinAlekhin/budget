import styled, { css } from 'styled-components'
import { rgba } from 'polished'

const grid = css`
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 2fr;
  grid-gap: 10px;
`

export const ColumnTitles = styled.div`
  ${grid}

  margin-top: 20px;
`

export const ColumnTitle = styled.span`
  text-transform: uppercase;
  font-size: 14px;

  &:first-child {
    text-align: left;
  }
`

export const Row = styled.div`
  ${grid}

  margin-top: 20px;
  align-items: center;
`

export const RowText = styled.span`
  font-size: 14px;
  text-align: ${({ title }) => (title ? 'left' : '')};
`

export const RowInput = styled.input`
  font-size: 14px;
  width: 100%;
  border: 1px solid ${rgba('#000', 0.2)};
  border-radius: 3px;
  padding: 5px;
`
