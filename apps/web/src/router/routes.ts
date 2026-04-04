import type { RouteRecordRaw } from 'vue-router'

// Extend RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    permission?: string
    title?: string
    requiresSubscription?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  // Auth routes (guest only)
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/login',
      },
      {
        path: 'login',
        name: 'login',
        meta: { guestOnly: true, title: 'Entrar' },
        component: () => import('pages/auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        meta: { guestOnly: true, title: 'Criar Conta' },
        component: () => import('pages/auth/RegisterPage.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        meta: { guestOnly: true, title: 'Recuperar Senha' },
        component: () => import('pages/auth/LoginPage.vue'), // Placeholder
      },
    ],
  },

  // Protected routes (requires auth)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { title: 'Dashboard' },
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'accounts',
        name: 'accounts',
        meta: { title: 'Contas', permission: 'accounts:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'transactions',
        name: 'transactions',
        meta: { title: 'Transacoes', permission: 'transactions:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'categories',
        name: 'categories',
        meta: { title: 'Categorias', permission: 'categories:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'recurring',
        name: 'recurring',
        meta: { title: 'Recorrencias', permission: 'recurring:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'budgets',
        name: 'budgets',
        meta: { title: 'Orcamentos', permission: 'budgets:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'goals',
        name: 'goals',
        meta: { title: 'Metas', permission: 'savings_goals:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'family',
        name: 'family',
        meta: { title: 'Familia', permission: 'family:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'rbac',
        children: [
          {
            path: 'groups',
            name: 'rbac-groups',
            meta: { title: 'Grupos', permission: 'groups:read' },
            component: () => import('pages/rbac/GroupsPage.vue'),
          },
          {
            path: 'permissions',
            name: 'rbac-permissions',
            meta: { title: 'Permissoes', permission: 'groups:read' },
            component: () => import('pages/rbac/PermissionsMatrixPage.vue'),
          },
        ],
      },
      {
        path: 'subscription',
        name: 'subscription',
        meta: { title: 'Assinatura', permission: 'billing:read' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
      {
        path: 'profile',
        name: 'profile',
        meta: { title: 'Meu Perfil' },
        component: () => import('pages/DashboardPage.vue'), // Placeholder
      },
    ],
  },

  // Error pages (no layout wrapper needed)
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('pages/errors/ForbiddenPage.vue'),
  },
  {
    path: '/paywall',
    name: 'paywall',
    component: () => import('pages/errors/PaywallPage.vue'),
  },

  // 404 fallback
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/errors/Error404Page.vue'),
  },
]

export default routes
