import { styled } from 'solid-styled-components'

export const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
  background: #17212b;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

export const LinkItem = styled('li')`
  list-style: none;
  padding: 0;
  margin: 0;
`
