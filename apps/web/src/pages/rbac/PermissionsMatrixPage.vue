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
            <span class="text-weight-bold">{{ tModule(props.value) }}</span>
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
import { ref, computed, onMounted } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import rbacService from 'src/services/rbac.service';
import type { Group, PermissionDef } from 'src/types/rbac';
import { tModule, tAction } from 'src/utils/translations';

const $q = useQuasar();

const groups = ref<Group[]>([]);
const allPermissions = ref<PermissionDef[]>([]);
const selectedGroupId = ref<string | null>(null);
const currentPermissionKeys = ref<Set<string>>(new Set());
const loading = ref(false);
const saving = ref(false);

// Extrair todas as ações únicas das permissões (dinâmico, não fixo)
const allActions = computed(() => {
  const acts = new Set<string>();
  allPermissions.value.forEach((p) => acts.add(p.action));
  return Array.from(acts).sort();
});

const groupOptions = computed(() => groups.value.map((g) => ({ label: g.name, value: g.id })));

const isMasterGroup = computed(() => {
  const group = groups.value.find((g) => g.id === selectedGroupId.value);
  return group?.slug === 'master';
});

// Build unique modules from all permissions
const modules = computed(() => {
  const mods = new Set<string>();
  allPermissions.value.forEach((p) => mods.add(p.module));
  return Array.from(mods).sort();
});

// All available actions per module
const moduleActions = computed(() => {
  const map = new Map<string, Set<string>>();
  allPermissions.value.forEach((p) => {
    if (!map.has(p.module)) map.set(p.module, new Set());
    map.get(p.module)!.add(p.action);
  });
  return map;
});

const matrixColumns = computed<QTableColumn[]>(() => [
  { name: 'module', label: 'Módulo', field: 'module', align: 'left' },
  ...allActions.value.map((a) => ({
    name: a,
    label: tAction(a),
    field: a,
    align: 'center' as const,
  })),
]);

const matrixRows = computed(() => modules.value.map((m) => ({ module: m })));

function hasAction(module: string, action: string): boolean {
  return moduleActions.value.get(module)?.has(action) ?? false;
}

function isChecked(module: string, action: string): boolean {
  if (isMasterGroup.value) return true;
  return currentPermissionKeys.value.has(`${module}:${action}`);
}

function togglePermission(module: string, action: string) {
  const key = `${module}:${action}`;
  if (currentPermissionKeys.value.has(key)) {
    currentPermissionKeys.value.delete(key);
  } else {
    currentPermissionKeys.value.add(key);
  }
}

/**
 * Converte as chaves module:action selecionadas em permissionIds
 * para enviar ao backend.
 */
function selectedPermissionIds(): string[] {
  const ids: string[] = [];
  for (const key of currentPermissionKeys.value) {
    const perm = allPermissions.value.find((p) => `${p.module}:${p.action}` === key);
    if (perm) ids.push(perm.id);
  }
  return ids;
}

async function onGroupChange() {
  if (!selectedGroupId.value) return;
  loading.value = true;
  try {
    const group = groups.value.find((g) => g.id === selectedGroupId.value);
    if (group?.slug === 'master') {
      // Master tem todas as permissoes
      currentPermissionKeys.value = new Set(
        allPermissions.value.map((p) => `${p.module}:${p.action}`),
      );
    } else {
      // Buscar permissoes reais do grupo via API
      try {
        const response = await rbacService.getGroupPermissions(selectedGroupId.value);
        const perms = response.data || response;
        currentPermissionKeys.value = new Set(
          (perms as PermissionDef[]).map((p: PermissionDef) => `${p.module}:${p.action}`),
        );
      } catch {
        // Se o endpoint nao existir, iniciar vazio
        currentPermissionKeys.value = new Set();
        $q.notify({
          type: 'warning',
          message:
            'Nao foi possivel carregar permissoes do grupo. Elas serao salvas ao clicar em Salvar.',
        });
      }
    }
  } finally {
    loading.value = false;
  }
}

async function savePermissions() {
  if (!selectedGroupId.value) return;
  saving.value = true;
  try {
    const ids = selectedPermissionIds();
    const response = await rbacService.updateGroupPermissions(selectedGroupId.value, ids);
    // Atualizar com a resposta do backend
    const perms = response.data || response;
    currentPermissionKeys.value = new Set(
      (perms as PermissionDef[]).map((p: PermissionDef) => `${p.module}:${p.action}`),
    );
    $q.notify({ type: 'positive', message: 'Permissoes salvas com sucesso!' });
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar permissoes' });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    const [groupsRes, permsRes] = await Promise.all([
      rbacService.listGroups(),
      rbacService.listPermissions(),
    ]);
    groups.value = groupsRes.data;
    allPermissions.value = permsRes.data;
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar dados' });
  } finally {
    loading.value = false;
  }
});
</script>
