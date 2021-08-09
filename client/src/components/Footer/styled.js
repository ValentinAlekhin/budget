import styled from 'styled-components'
import { rgba, darken } from 'polished'
import { NavLink } from 'react-router-dom'

export const StyledFooter = styled.footer`
  position: fixed;
  height: 60px;
  bottom: 0;
  left: 0;
  right: 0;
  background: #393E46;
  border-radius: 10px 10px 0 0;
  box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
`

export const Nav = styled.nav`
  .swiper-slide {
    width: auto;
  }
`

export const LinkItem = styled.li`
  display: flex;
  align-items: center;
`

export const StyledNavLink = styled(NavLink)`
  margin: 0 10px;
  padding: 7px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  border-radius: 10px;

  &.active {
    background: #00ADB5;
  }
`
