import styled from 'styled-components'
import { rgba } from 'polished'
import { NavLink } from 'react-router-dom'

export const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.2);
`

export const Nav = styled.nav`
  .swiper-slide {
    width: auto;
  }
`

export const LinkItem = styled.li`
  display: flex;
  align-items: center;
  height: 50px;
`

export const StyledNavLink = styled(NavLink)`
  height: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  background: #fff;
  border-right: 0.5px solid ${rgba('#000', 0.1)};
  border-left: ${({ first }) =>
    first ? `0.5px solid ${rgba('#000', 0.1)}` : ''};

  &.active {
    background: ${rgba('#000', 0.1)};
  }
`
