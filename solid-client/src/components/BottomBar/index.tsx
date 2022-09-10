import { Component, For } from 'solid-js'
import { Footer, LinkItem } from './styled'
import { Link, useLocation } from '@solidjs/router'
import {
  BiSolidChart,
  BiSolidData,
  BiSolidDirections,
  BiSolidWallet,
} from 'solid-icons/bi'

const links = [
  { label: 'Cost', href: '/', icon: BiSolidWallet },
  { label: 'Dist', href: '/dist', icon: BiSolidDirections },
  { label: 'DB', href: '/db', icon: BiSolidData },
  { label: 'Stat', href: '/stat', icon: BiSolidChart },
]

const BottomBar: Component = () => {
  const location = useLocation()

  const isActiveLink = ({ href }: { href: string }) =>
    href === location.pathname

  return (
    <Footer>
      <For each={links}>
        {(link) => (
          <LinkItem>
            <Link href={link.href}>
              <link.icon
                size="25"
                color={isActiveLink(link) ? '#3f96d0' : '#758b9d'}
                style={{
                  transform: `scale(${isActiveLink(link) ? 1.2 : 1})`,
                }}
              />
            </Link>
          </LinkItem>
        )}
      </For>
    </Footer>
  )
}

export default BottomBar
