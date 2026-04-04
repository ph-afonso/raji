<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Grupos</div>
      <q-btn
        v-perm="'groups:create'"
        color="primary"
        icon="add"
        label="Novo Grupo"
        no-caps
        @click="openDialog()"
      />
    </div>

    <q-table
      :rows="groups"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template #body-cell-isDefault="props">
        <q-td :props="props">
          <q-badge v-if="props.row.isDefault" color="primary" label="Padrao" />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            v-perm="'groups:update'"
            flat
            round
            icon="edit"
            size="sm"
            @click="openDialog(props.row)"
          />
          <q-btn
            v-perm="'groups:delete'"
            flat
            round
            icon="delete"
            size="sm"
            color="negative"
            :disable="props.row.isDefault"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip v-if="props.row.isDefault">
              Nao e possivel excluir grupo padrao
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            {{ editingGroup ? 'Editar Grupo' : 'Novo Grupo' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="onSave">
            <q-input
              v-model="formName"
              label="Nome do grupo"
              outlined
              :rules="[(val: string) => !!val || 'Nome e obrigatorio']"
              autofocus
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            color="primary"
            label="Salvar"
            :loading="saving"
            @click="onSave"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import rbacService from 'src/services/rbac.service'
import type { Group } from 'src/types/rbac'

const $q = useQuasar()

const groups = ref<Group[]>([])
const loading = ref(false)
const saving = ref(false)
const dialogOpen = ref(false)
const formName = ref('')
const editingGroup = ref<Group | null>(null)

const columns: QTableColumn[] = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'slug', label: 'Slug', field: 'slug', align: 'left' },
  { name: 'membersCount', label: 'Membros', field: 'membersCount', align: 'center' },
  { name: 'isDefault', label: 'Padrao', field: 'isDefault', align: 'center' },
  { name: 'actions', label: 'Acoes', field: 'id', align: 'center' },
]

async function fetchGroups() {
  loading.value = true
  try {
    const response = await rbacService.listGroups()
    groups.value = response.data
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar grupos' })
  } finally {
    loading.value = false
  }
}

function openDialog(group?: Group) {
  editingGroup.value = group || null
  formName.value = group?.name || ''
  dialogOpen.value = true
}

async function onSave() {
  if (!formName.value.trim()) return
  saving.value = true
  try {
    if (editingGroup.value) {
      await rbacService.updateGroup(editingGroup.value.id, { name: formName.value })
      $q.notify({ type: 'positive', message: 'Grupo atualizado!' })
    } else {
      await rbacService.createGroup({ name: formName.value })
      $q.notify({ type: 'positive', message: 'Grupo criado!' })
    }
    dialogOpen.value = false
    await fetchGroups()
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar grupo' })
  } finally {
    saving.value = false
  }
}

function confirmDelete(group: Group) {
  $q.dialog({
    title: 'Confirmar exclusao',
    message: `Deseja realmente excluir o grupo "${group.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await rbacService.deleteGroup(group.id)
      $q.notify({ type: 'positive', message: 'Grupo excluido!' })
      await fetchGroups()
    } catch {
      $q.notify({ type: 'negative', message: 'Erro ao excluir grupo' })
    }
  })
}

onMounted(fetchGroups)
</script>
