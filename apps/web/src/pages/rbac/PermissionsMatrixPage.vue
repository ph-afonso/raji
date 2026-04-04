<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Permissões</div>
    </div>

    <!-- Seletor de grupo -->
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

    <!-- Banner Master -->
    <q-banner v-if="isMasterGroup" class="bg-blue-1 text-blue-9 q-mb-md" rounded>
      <template #avatar>
        <q-icon name="shield" color="blue" />
      </template>
      O grupo <strong>Administrador</strong> possui todas as permissões e não pode ser editado.
    </q-banner>

    <!-- Loading -->
    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots size="40px" color="primary" />
    </div>

    <!-- Accordions de módulos -->
    <q-list v-if="selectedGroupId && !loading" bordered separator class="rounded-borders">
      <q-expansion-item
        v-for="mod in modules"
        :key="mod"
        :icon="moduleIcons[mod] || 'folder'"
        :label="tModule(mod)"
        :caption="moduleCaption(mod)"
        header-class="text-weight-medium"
        expand-icon-class="text-primary"
      >
        <q-list separator dense class="q-pl-sm">
          <q-item v-for="action in getModuleActions(mod)" :key="action">
            <q-item-section>
              <q-item-label>{{ actionDescription(mod, action) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle
                :model-value="isChecked(mod, action)"
                :disable="isMasterGroup"
                color="primary"
                @update:model-value="togglePermission(mod, action)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>

    <!-- Placeholder quando nenhum grupo selecionado -->
    <div v-if="!selectedGroupId && !loading" class="text-center text-grey q-pa-xl">
      <q-icon name="security" size="64px" class="q-mb-md" />
      <div class="text-h6">Selecione um grupo</div>
      <div>Escolha um grupo acima para visualizar e editar suas permissões</div>
    </div>

    <!-- Botão salvar -->
    <div v-if="selectedGroupId && !loading" class="q-mt-lg row justify-end q-gutter-sm">
      <q-btn
        outline
        color="grey"
        label="Marcar todos"
        no-caps
        :disable="isMasterGroup"
        @click="selectAll"
      />
      <q-btn
        outline
        color="grey"
        label="Desmarcar todos"
        no-caps
        :disable="isMasterGroup"
        @click="deselectAll"
      />
      <q-btn
        color="primary"
        icon="save"
        label="Salvar permissões"
        :loading="saving"
        :disable="isMasterGroup"
        no-caps
        @click="savePermissions"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import rbacService from 'src/services/rbac.service';
import type { Group, PermissionDef } from 'src/types/rbac';
import { tModule, tAction, moduleLabels, actionLabels } from 'src/utils/translations';

const $q = useQuasar();

const groups = ref<Group[]>([]);
const allPermissions = ref<PermissionDef[]>([]);
const selectedGroupId = ref<string | null>(null);
const currentPermissionKeys = ref<Set<string>>(new Set());
const loading = ref(false);
const saving = ref(false);

// Ícones por módulo
const moduleIcons: Record<string, string> = {
  accounts: 'account_balance',
  transactions: 'receipt_long',
  categories: 'category',
  budgets: 'savings',
  savings_goals: 'flag',
  recurring: 'autorenew',
  family: 'home',
  members: 'people',
  groups: 'admin_panel_settings',
  billing: 'credit_card',
  reports: 'assessment',
  notifications: 'notifications',
};

const groupOptions = computed(() => groups.value.map((g) => ({ label: g.name, value: g.id })));

const isMasterGroup = computed(() => {
  const group = groups.value.find((g) => g.id === selectedGroupId.value);
  return group?.slug === 'master';
});

// Módulos únicos
const modules = computed(() => {
  const mods = new Set<string>();
  allPermissions.value.forEach((p) => mods.add(p.module));
  return Array.from(mods).sort();
});

// Ações por módulo
const moduleActionsMap = computed(() => {
  const map = new Map<string, string[]>();
  allPermissions.value.forEach((p) => {
    if (!map.has(p.module)) map.set(p.module, []);
    const actions = map.get(p.module)!;
    if (!actions.includes(p.action)) actions.push(p.action);
  });
  return map;
});

function getModuleActions(mod: string): string[] {
  return moduleActionsMap.value.get(mod) || [];
}

// Gera descrições como "Permitir criar contas?"
const actionDescriptions: Record<string, Record<string, string>> = {
  create: { prefix: 'Permitir criar', suffix: '?' },
  read: { prefix: 'Permitir visualizar', suffix: '?' },
  update: { prefix: 'Permitir editar', suffix: '?' },
  delete: { prefix: 'Permitir excluir', suffix: '?' },
  import: { prefix: 'Permitir importar', suffix: '?' },
  invite: { prefix: 'Permitir convidar', suffix: '?' },
  remove: { prefix: 'Permitir remover', suffix: '?' },
  change_group: { prefix: 'Permitir alterar grupo de', suffix: '?' },
  manage: { prefix: 'Permitir gerenciar', suffix: '?' },
};

function actionDescription(mod: string, action: string): string {
  const moduleName = tModule(mod).toLowerCase();
  const desc = actionDescriptions[action];
  if (desc) {
    return `${desc.prefix} ${moduleName}${desc.suffix}`;
  }
  return `Permitir ${tAction(action).toLowerCase()} ${moduleName}?`;
}

// Caption mostra "X de Y selecionadas"
function moduleCaption(mod: string): string {
  const actions = getModuleActions(mod);
  const checked = actions.filter((a) => isChecked(mod, a)).length;
  return `${checked} de ${actions.length} permissões`;
}

function isChecked(module: string, action: string): boolean {
  if (isMasterGroup.value) return true;
  return currentPermissionKeys.value.has(`${module}:${action}`);
}

function togglePermission(module: string, action: string) {
  const key = `${module}:${action}`;
  const newSet = new Set(currentPermissionKeys.value);
  if (newSet.has(key)) {
    newSet.delete(key);
  } else {
    newSet.add(key);
  }
  currentPermissionKeys.value = newSet;
}

function selectAll() {
  currentPermissionKeys.value = new Set(allPermissions.value.map((p) => `${p.module}:${p.action}`));
}

function deselectAll() {
  currentPermissionKeys.value = new Set();
}

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
      currentPermissionKeys.value = new Set(
        allPermissions.value.map((p) => `${p.module}:${p.action}`),
      );
    } else {
      try {
        const response = await rbacService.getGroupPermissions(selectedGroupId.value);
        const perms = response.data || response;
        currentPermissionKeys.value = new Set(
          (perms as PermissionDef[]).map((p: PermissionDef) => `${p.module}:${p.action}`),
        );
      } catch {
        currentPermissionKeys.value = new Set();
        $q.notify({
          type: 'warning',
          message: 'Não foi possível carregar permissões do grupo. Marque as desejadas e salve.',
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
    await rbacService.updateGroupPermissions(selectedGroupId.value, ids);
    $q.notify({
      type: 'positive',
      message: 'Permissões salvas com sucesso!',
      icon: 'check_circle',
    });
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar permissões' });
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
