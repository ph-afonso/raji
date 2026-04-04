<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">Meu Perfil</div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Avatar e info basica -->
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section class="text-center">
            <q-avatar size="100px" color="primary" text-color="white">
              <img v-if="profile?.avatarUrl" :src="profile.avatarUrl" />
              <span v-else class="text-h4">{{ initials }}</span>
            </q-avatar>
            <div class="text-h6 q-mt-md">{{ profile?.name }}</div>
            <div class="text-caption text-grey">{{ profile?.email }}</div>
            <q-badge
              v-if="profile?.isFamilyOwner"
              color="primary"
              label="Titular da familia"
              class="q-mt-sm"
            />
          </q-card-section>

          <q-separator />

          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon name="group" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Grupo</q-item-label>
                <q-item-label>{{ groupName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Formulario de edicao -->
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Editar Perfil</div>
          </q-card-section>

          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="onSave">
              <q-input
                v-model="formName"
                label="Nome"
                outlined
                :rules="[(val: string) => !!val || 'Nome e obrigatorio']"
              />

              <q-input
                :model-value="profile?.email"
                label="Email"
                outlined
                disable
                hint="O email nao pode ser alterado"
              />

              <div class="row justify-end">
                <q-btn color="primary" label="Salvar" type="submit" :loading="saving" no-caps />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import usersService from 'src/services/users.service';
import { useAuthStore } from 'src/stores/auth.store';
import type { User } from 'src/types/auth';

const $q = useQuasar();
const authStore = useAuthStore();

const profile = ref<User | null>(null);
const formName = ref('');
const saving = ref(false);
const loading = ref(false);

const initials = computed(() => {
  if (!profile.value?.name) return '?';
  return profile.value.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const groupName = computed(() => {
  // O grupo vem do user — se o backend retornar group info, usamos.
  // Por enquanto, exibimos o groupId.
  return authStore.currentUser?.groupId || '-';
});

async function loadProfile() {
  loading.value = true;
  try {
    const response = await usersService.getProfile();
    profile.value = response.data;
    formName.value = response.data.name;
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao carregar perfil' });
  } finally {
    loading.value = false;
  }
}

async function onSave() {
  if (!formName.value.trim()) return;
  saving.value = true;
  try {
    const response = await usersService.updateProfile({ name: formName.value });
    profile.value = response.data;
    // Atualizar store local
    authStore.setUser(response.data);
    $q.notify({ type: 'positive', message: 'Perfil atualizado!' });
  } catch {
    $q.notify({ type: 'negative', message: 'Erro ao salvar perfil' });
  } finally {
    saving.value = false;
  }
}

onMounted(loadProfile);
</script>
