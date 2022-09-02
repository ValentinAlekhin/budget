import { styled } from 'solid-styled-components'

export const Inp = styled.input`
  border-radius: 4px;
  display: block;
  padding: 8px;
  margin-bottom: 8px;
  color: #fff;
  background: #242f3d;
  outline: none;
  border: 2px solid rgba(0, 0, 0, 0);
  transition: all ease 0.2s;
  width: 100%;

  &:focus {
    border: 2px solid #3f96d0;
  }

  &:disabled {
    opacity: 0.7;
  }
`
