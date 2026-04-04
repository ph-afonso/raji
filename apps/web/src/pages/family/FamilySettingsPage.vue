<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Familia</div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Info da familia -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Informacoes</div>
          </q-card-section>

          <q-card-section v-if="familyStore.loadingFamily" class="text-center">
            <q-spinner size="40px" />
          </q-card-section>

          <q-card-section v-else-if="familyStore.family">
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="home" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Nome da familia</q-item-label>
                  <q-item-label>{{ familyStore.family.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="people" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Total de membros</q-item-label>
                  <q-item-label>{{ familyStore.family._count?.users || 0 }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="calendar_today" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Criada em</q-item-label>
                  <q-item-label>{{ formatDate(familyStore.family.createdAt) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Editar nome (apenas owner) -->
      <div v-if="isOwner" class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Editar Familia</div>
          </q-card-section>

          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="onSave">
              <q-input
                v-model="formName"
                label="Nome da familia"
                outlined
                :rules="[(val: string) => !!val || 'Nome e obrigatorio']"
              />

              <div class="row justify-end">
                <q-btn
                  v-perm="'family:update'"
                  color="primary"
                  label="Salvar"
                  type="submit"
                  :loading="saving"
                  no-caps
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lista de membros resumida -->
    <div class="q-mt-lg">
      <div class="row items-center q-mb-md">
        <div class="text-h6 col">Membros</div>
        <q-btn
          flat
          color="primary"
          label="Ver todos"
          no-caps
          :to="{ name: 'family-members' }"
          icon-right="arrow_forward"
        />
      </div>

      <q-table
        :rows="familyStore.members"
        :columns="memberColumns"
        row-key="id"
        flat
        bordered
        :loading="familyStore.loadingMembers"
        hide-pagination
        :rows-per-page-options="[0]"
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
                <div class="text-caption text-grey">{{ props.row.email }}</div>
              </div>
            </div>
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

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.isActive ? 'positive' : 'negative'"
              :label="props.row.isActive ? 'Ativo' : 'Inativo'"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import { useFamilyStore } from 'src/stores/family.store';

const $q = useQuasar();
const authStore = useAuthStore();
const familyStore = useFamilyStore();

const formName = ref('');
const saving = ref(false);

const isOwner = computed(() => authStore.currentUser?.isFamilyOwner === true);

const memberColumns: QTableColumn[] = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left' },
  { name: 'group', label: 'Grupo', field: (row) => row.group?.name, align: 'center' },
  { name: 'status', label: 'Status', field: 'isActive', align: 'center' },
];

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

async function onSave() {
  if (!formName.value.trim()) return;
  saving.value = true;
  try {
    await familyStore.updateFamily(formName.value);
    $q.notify({ type: 'positive', message: 'Familia atualizada!' });
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar familia' });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  try {
    await Promise.all([familyStore.loadFamily(), familyStore.loadMembers()]);
    if (familyStore.family) {
      formName.value = familyStore.family.name;
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados da familia' });
  }
});
</script>
