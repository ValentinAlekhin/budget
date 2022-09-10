import { RouteDefinition } from '@solidjs/router'
import Cost from '../pages/cost'
import DB from '../pages/db'
import Dist from '../pages/distrib'
import Stat from '../pages/stat'
import Login from '../pages/Auth/login'

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Cost,
  },
  {
    path: '/db',
    component: DB,
  },
  {
    path: '/dist',
    component: Dist,
  },
  {
    path: '/stat',
    component: Stat,
  },
  {
    path: '/auth/login',
    component: Login,
  },
]
