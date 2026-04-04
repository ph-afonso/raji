import {
  createRouter,
  createMemoryHistory,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { authGuard } from './guards/auth.guard'
import { permissionGuard } from './guards/permission.guard'
import { subscriptionGuard } from './guards/subscription.guard'

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE),
})

// Register navigation guards in order
Router.beforeEach(authGuard)
Router.beforeEach(permissionGuard)
Router.beforeEach(subscriptionGuard)

export default Router
