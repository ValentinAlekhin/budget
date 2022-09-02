import { For } from "solid-js";
import React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import DataArrayIcon from '@mui/icons-material/DataArray'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useRouter } from 'next/router'

const links = [
  { label: 'Cost', value: 'cost', icon: MonetizationOnIcon },
  { label: 'Dist', value: 'dist', icon: AddBoxIcon },
  { label: 'DB', value: 'db', icon: DataArrayIcon },
  { label: 'Stat', value: 'stat', icon: QueryStatsIcon },
]

export const Footer = () => {
  const router = useRouter()
  const [value, setValue] = React.useState('recents')

  const handleChange = async (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    await router.push(`/${newValue}`)
  }

  return (
    <footer style={{ position: 'fixed', bottom: 0, right: 0, left: 0, display: 'flex', "justify-content": 'center' } }>
      <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
        <For each={links}>{link => <BottomNavigationAction key={link.value} value={link.value} label={link.label} icon={<link.icon/>} />}</For>
      </BottomNavigation >
    </footer>

  )
}