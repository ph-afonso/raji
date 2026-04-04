<template>
  <q-layout view="lHh LpR lFf">
    <TheHeader @toggle-drawer="toggleDrawer" />

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      bordered
      :width="260"
      :breakpoint="1024"
    >
      <TheSidebar />
    </q-drawer>

    <q-page-container>
      <TheBreadcrumb />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'
import TheBreadcrumb from './components/TheBreadcrumb.vue'

const drawerOpen = ref(false)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>
