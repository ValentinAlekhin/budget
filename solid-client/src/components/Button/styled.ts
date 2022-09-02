import { styled } from 'solid-styled-components'

export const Btn = styled('button')`
  border-radius: 4px;
  display: block;
  padding: 8px;
  margin-bottom: 6px;
  width: 100%;
  background: #3f96d0;
  color: #fff;
  border: none;
  outline: none;

  &:disabled {
    opacity: 0.7;
  }
`
