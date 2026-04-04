<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" :to="{ name: 'family' }" class="q-mr-sm" />
      <div class="text-h5 col">Membros da Familia</div>
    </div>

    <q-table
      :rows="familyStore.members"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :loading="familyStore.loadingMembers"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar size="32px" color="grey-4" class="q-mr-sm">
              <img v-if="props.row.avatarUrl" :src="props.row.avatarUrl" />
              <span v-else class="text-caption">{{ getInitials(props.row.name) }}</span>
            </q-avatar>
            <div>
              <div>{{ props.row.name }}</div>
              <q-badge
                v-if="props.row.isFamilyOwner"
                color="amber"
                text-color="black"
                label="Titular"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-email="props">
        <q-td :props="props">
          {{ props.row.email }}
        </q-td>
      </template>

      <template #body-cell-group="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.group?.slug === 'master' ? 'primary' : 'grey'"
            :label="props.row.group?.name || '-'"
          />
        </q-td>
      </template>

      <template #body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-select
            v-if="!props.row.isFamilyOwner"
            v-perm="'groups:update'"
            :model-value="props.row.group?.id"
            :options="groupOptions"
            emit-value
            map-options
            dense
            outlined
            style="min-width: 150px"
            @update:model-value="(val: string) => onChangeGroup(props.row.id, val)"
          />
          <span v-else class="text-caption text-grey">--</span>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog de confirmacao para trocar grupo -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Confirmar troca de grupo</div>
        </q-card-section>

        <q-card-section>
          Deseja realmente trocar o grupo deste membro para
          <strong>{{ pendingGroupName }}</strong
          >?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat label="Cancelar" />
          <q-btn
            color="primary"
            label="Confirmar"
            :loading="changingGroup"
            no-caps
            @click="confirmChangeGroup"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useFamilyStore } from 'src/stores/family.store';
import rbacService from 'src/services/rbac.service';
import type { Group } from 'src/types/rbac';

const $q = useQuasar();
const familyStore = useFamilyStore();

const groups = ref<Group[]>([]);
const confirmDialog = ref(false);
const changingGroup = ref(false);
const pendingUserId = ref('');
const pendingGroupId = ref('');

const columns: QTableColumn[] = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'group', label: 'Grupo', field: (row) => row.group?.name, align: 'center' },
  { name: 'createdAt', label: 'Entrada', field: 'createdAt', align: 'center', sortable: true },
  { name: 'actions', label: 'Trocar Grupo', field: 'id', align: 'center' },
];

const groupOptions = computed(() => groups.value.map((g) => ({ label: g.name, value: g.id })));

const pendingGroupName = computed(() => {
  const g = groups.value.find((g) => g.id === pendingGroupId.value);
  return g?.name || '-';
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function onChangeGroup(userId: string, groupId: string) {
  pendingUserId.value = userId;
  pendingGroupId.value = groupId;
  confirmDialog.value = true;
}

async function confirmChangeGroup() {
  changingGroup.value = true;
  try {
    await rbacService.changeUserGroup(pendingUserId.value, pendingGroupId.value);
    $q.notify({ type: 'positive', message: 'Grupo do membro atualizado!' });
    confirmDialog.value = false;
    // Recarregar membros
    await familyStore.loadMembers();
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao trocar grupo do membro' });
  } finally {
    changingGroup.value = false;
  }
}

async function loadGroups() {
  try {
    const response = await rbacService.listGroups();
    groups.value = response.data;
  } catch {
    // Silencioso — grupos nao carregados impede apenas a troca
  }
}

onMounted(async () => {
  await Promise.all([familyStore.loadMembers(), loadGroups()]);
});
</script>
