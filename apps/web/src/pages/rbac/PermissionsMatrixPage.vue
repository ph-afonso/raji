<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Matriz de Permissoes</div>
    </div>

    <!-- Group selector -->
    <div class="row q-mb-lg" style="max-width: 400px">
      <q-select
        v-model="selectedGroupId"
        :options="groupOptions"
        label="Selecionar grupo"
        outlined
        emit-value
        map-options
        class="full-width"
        @update:model-value="onGroupChange"
      />
    </div>

    <q-table
      v-if="selectedGroupId"
      :rows="matrixRows"
      :columns="matrixColumns"
      row-key="module"
      flat
      bordered
      :loading="loading"
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template #body-cell="props">
        <q-td :props="props">
          <!-- Module name column -->
          <template v-if="props.col.name === 'module'">
            <span class="text-weight-bold text-capitalize">{{ props.value }}</span>
          </template>
          <!-- Action checkbox columns -->
          <template v-else>
            <q-checkbox
              v-if="hasAction(props.row.module, props.col.name)"
              :model-value="isChecked(props.row.module, props.col.name)"
              :disable="isMasterGroup"
              @update:model-value="togglePermission(props.row.module, props.col.name)"
            />
            <span v-else class="text-grey-5">--</span>
          </template>
        </q-td>
      </template>
    </q-table>

    <div v-if="selectedGroupId" class="q-mt-md row justify-end">
      <q-btn
        color="primary"
        label="Salvar permissoes"
        :loading="saving"
        :disable="isMasterGroup"
        no-caps
        @click="savePermissions"
      />
    </div>

    <q-banner v-if="isMasterGroup" class="bg-info text-white q-mt-md" rounded>
      <template #avatar>
        <q-icon name="info" />
      </template>
      O grupo Master possui todas as permissoes e nao pode ser editado.
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import rbacService from 'src/services/rbac.service'
import type { Group, PermissionDef } from 'src/types/rbac'

const $q = useQuasar()

const groups = ref<Group[]>([])
const allPermissions = ref<PermissionDef[]>([])
const selectedGroupId = ref<string | null>(null)
const currentPermissions = ref<Set<string>>(new Set())
const loading = ref(false)
const saving = ref(false)

const actions = ['create', 'read', 'update', 'delete']

const groupOptions = computed(() =>
  groups.value.map((g) => ({ label: g.name, value: g.id })),
)

const isMasterGroup = computed(() => {
  const group = groups.value.find((g) => g.id === selectedGroupId.value)
  return group?.slug === 'master'
})

// Build unique modules from all permissions
const modules = computed(() => {
  const mods = new Set<string>()
  allPermissions.value.forEach((p) => mods.add(p.module))
  return Array.from(mods).sort()
})

// All available actions per module
const moduleActions = computed(() => {
  const map = new Map<string, Set<string>>()
  allPermissions.value.forEach((p) => {
    if (!map.has(p.module)) map.set(p.module, new Set())
    map.get(p.module)!.add(p.action)
  })
  return map
})

const matrixColumns = computed<QTableColumn[]>(() => [
  { name: 'module', label: 'Modulo', field: 'module', align: 'left' },
  ...actions.map((a) => ({
    name: a,
    label: a.charAt(0).toUpperCase() + a.slice(1),
    field: a,
    align: 'center' as const,
  })),
])

const matrixRows = computed(() =>
  modules.value.map((m) => ({ module: m })),
)

function hasAction(module: string, action: string): boolean {
  return moduleActions.value.get(module)?.has(action) ?? false
}

function isChecked(module: string, action: string): boolean {
  if (isMasterGroup.value) return true
  return currentPermissions.value.has(`${module}:${action}`)
}

function togglePermission(module: string, action: string) {
  const key = `${module}:${action}`
  if (currentPermissions.value.has(key)) {
    currentPermissions.value.delete(key)
  } else {
    currentPermissions.value.add(key)
  }
}

async function onGroupChange() {
  if (!selectedGroupId.value) return
  loading.value = true
  try {
    // Load current group permissions — for now we parse from allPermissions
    // The actual group permissions will come from a future endpoint
    // Placeholder: load all permissions for master, empty for others
    const group = groups.value.find((g) => g.id === selectedGroupId.value)
    if (group?.slug === 'master') {
      currentPermissions.value = new Set(
        allPermissions.value.map((p) => `${p.module}:${p.action}`),
      )
    } else {
      // In a real app, fetch group-specific permissions from API
      currentPermissions.value = new Set()
    }
  } finally {
    loading.value = false
  }
}

async function savePermissions() {
  if (!selectedGroupId.value) return
  saving.value = true
  try {
    await rbacService.updateGroupPermissions(
      selectedGroupId.value,
      Array.from(currentPermissions.value),
    )
    $q.notify({ type: 'positive', message: 'Permissoes salvas com sucesso!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar permissoes' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [groupsRes, permsRes] = await Promise.all([
      rbacService.listGroups(),
      rbacService.listPermissions(),
    ])
    groups.value = groupsRes.data
    allPermissions.value = permsRes.data
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados' })
  } finally {
    loading.value = false
  }
})
</script>
