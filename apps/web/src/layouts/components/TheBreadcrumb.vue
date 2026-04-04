<template>
  <q-breadcrumbs class="q-px-md q-py-sm" v-if="crumbs.length > 1">
    <q-breadcrumbs-el
      v-for="crumb in crumbs"
      :key="crumb.path"
      :label="crumb.label"
      :to="crumb.path"
      :icon="crumb.icon"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Crumb {
  label: string
  path: string
  icon?: string
}

const route = useRoute()

const crumbs = computed<Crumb[]>(() => {
  const result: Crumb[] = [
    { label: 'Inicio', path: '/dashboard', icon: 'home' },
  ]

  const matched = route.matched.filter((r) => r.meta.title)

  matched.forEach((record) => {
    if (record.path !== '/dashboard' && record.path !== '/') {
      result.push({
        label: record.meta.title as string,
        path: record.path,
      })
    }
  })

  return result
})
</script>
