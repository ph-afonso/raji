<template>
  <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'">
    <q-toolbar>
      <!-- Drawer toggle (mobile) -->
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        class="lt-md"
        @click="emit('toggleDrawer')"
      />

      <!-- Page title -->
      <q-toolbar-title class="text-weight-bold text-subtitle1">
        {{ pageTitle }}
      </q-toolbar-title>

      <q-space />

      <!-- Dark mode toggle -->
      <q-btn
        flat
        round
        :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
        @click="$q.dark.toggle()"
      />

      <!-- Notifications -->
      <q-btn flat round icon="notifications">
        <q-badge color="negative" floating>3</q-badge>
      </q-btn>

      <!-- Avatar dropdown -->
      <q-btn flat round>
        <q-avatar size="32px" color="primary" text-color="white">
          <img v-if="authStore.currentUser?.avatarUrl" :src="authStore.currentUser.avatarUrl" />
          <span v-else class="text-caption">{{ userInitials }}</span>
        </q-avatar>
        <q-menu>
          <q-list style="min-width: 180px">
            <q-item>
              <q-item-section>
                <q-item-label>{{ authStore.currentUser?.name }}</q-item-label>
                <q-item-label caption>{{ authStore.currentUser?.email }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup to="/profile">
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>Meu Perfil</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
              <q-item-section class="text-negative">Sair</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.store'

const emit = defineEmits<{
  toggleDrawer: []
}>()

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  return (route.meta.title as string) || 'Raji Finance'
})

const userInitials = computed(() => {
  const name = authStore.currentUser?.name || ''
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
