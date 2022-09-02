import { atom } from 'recoil'

const costState = atom<any[]>({
  key: 'cost',
  default: [],
})