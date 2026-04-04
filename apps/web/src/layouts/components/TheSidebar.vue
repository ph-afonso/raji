<template>
  <div class="fit column no-wrap">
    <!-- User info -->
    <div class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <q-avatar size="42px" color="primary" text-color="white">
          <img v-if="authStore.currentUser?.avatarUrl" :src="authStore.currentUser.avatarUrl" />
          <span v-else>{{ userInitials }}</span>
        </q-avatar>
        <div class="col">
          <div class="text-subtitle2 text-weight-bold ellipsis">
            {{ authStore.currentUser?.name || 'Usuario' }}
          </div>
          <div class="text-caption text-grey ellipsis">
            {{ familyLabel }}
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <!-- Navigation -->
    <q-list class="col q-pt-sm" style="overflow-y: auto">
      <template v-for="item in visibleMenuItems" :key="item.route">
        <q-item
          clickable
          v-ripple
          :to="item.route"
          active-class="text-primary bg-primary-alpha"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </template>
    </q-list>

    <q-separator />

    <!-- Logout -->
    <div class="q-pa-sm">
      <q-item clickable v-ripple @click="handleLogout">
        <q-item-section avatar>
          <q-icon name="logout" color="negative" />
        </q-item-section>
        <q-item-section class="text-negative">Sair</q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.store'
import { useRbacStore } from 'src/stores/rbac.store'

const authStore = useAuthStore()
const rbacStore = useRbacStore()
const router = useRouter()

interface MenuItem {
  label: string
  icon: string
  route: string
  permission?: string
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Contas', icon: 'account_balance', route: '/accounts', permission: 'accounts:read' },
  { label: 'Transacoes', icon: 'receipt_long', route: '/transactions', permission: 'transactions:read' },
  { label: 'Categorias', icon: 'category', route: '/categories', permission: 'categories:read' },
  { label: 'Recorrencias', icon: 'autorenew', route: '/recurring', permission: 'recurring:read' },
  { label: 'Orcamentos', icon: 'savings', route: '/budgets', permission: 'budgets:read' },
  { label: 'Metas', icon: 'flag', route: '/goals', permission: 'savings_goals:read' },
  { label: 'Familia', icon: 'group', route: '/family', permission: 'family:read' },
  { label: 'Grupos/Permissoes', icon: 'admin_panel_settings', route: '/rbac/groups', permission: 'groups:read' },
  { label: 'Assinatura', icon: 'credit_card', route: '/subscription', permission: 'billing:read' },
]

const visibleMenuItems = computed(() =>
  menuItems.filter(
    (item) => !item.permission || rbacStore.hasPermission(item.permission),
  ),
)

const userInitials = computed(() => {
  const name = authStore.currentUser?.name || ''
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const familyLabel = computed(() => {
  return authStore.currentUser?.isFamilyOwner ? 'Administrador' : 'Membro'
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.bg-primary-alpha {
  background: rgba(108, 99, 255, 0.1);
}
</style>
