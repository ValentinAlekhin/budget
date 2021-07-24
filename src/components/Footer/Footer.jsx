import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.scss'

import { StyledNavLink, StyledFooter, Nav, LinkItem } from './styled'

const Footer = () => {
  const links = [
    { title: 'Траты', link: '/' },
    { title: 'Распределение', link: '/distrib' },
    { title: 'Статистика', link: '/stats' },
    { title: 'Отложенные', link: '/otklad' },
    { title: 'Настройки', link: '/settings' },
  ]

  return (
    <StyledFooter>
      <Nav>
        <ul>
          <Swiper spaceBetween={0} slidesPerView={'auto'} freeMode={true}>
            {links.map(({ title, link }, i) => (
              <SwiperSlide key={link}>
                <LinkItem>
                  <StyledNavLink to={link} exact first={!i}>
                    <span>{title}</span>
                  </StyledNavLink>
                </LinkItem>
              </SwiperSlide>
            ))}
          </Swiper>
        </ul>
      </Nav>
    </StyledFooter>
  )
}

export default Footer
