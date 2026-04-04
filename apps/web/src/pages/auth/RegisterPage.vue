<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6 text-center q-mb-md">Criar Conta</div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.name"
          label="Nome completo"
          outlined
          :rules="[(val: string) => !!val || 'Nome e obrigatorio']"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          v-model="form.email"
          label="E-mail"
          type="email"
          outlined
          :rules="[
            (val: string) => !!val || 'E-mail e obrigatorio',
            (val: string) => isValidEmail(val) || 'E-mail invalido',
          ]"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          v-model="form.password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[
            (val: string) => !!val || 'Senha e obrigatoria',
            (val: string) => val.length >= 6 || 'Minimo 6 caracteres',
          ]"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-input
          v-model="form.confirmPassword"
          label="Confirmar senha"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[
            (val: string) => !!val || 'Confirmacao e obrigatoria',
            (val: string) => val === form.password || 'As senhas nao conferem',
          ]"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="lock_outline" />
          </template>
        </q-input>

        <q-input
          v-model="form.familyName"
          label="Nome da familia"
          outlined
          hint="Ex: Familia Silva"
          :rules="[(val: string) => !!val || 'Nome da familia e obrigatorio']"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="group" />
          </template>
        </q-input>

        <div>
          <q-btn
            type="submit"
            label="Criar conta"
            color="primary"
            class="full-width"
            size="lg"
            :loading="loading"
            no-caps
          />
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="text-center q-pt-none">
      <span class="text-grey">Ja tem conta? </span>
      <router-link to="/login" class="text-primary text-weight-bold">
        Entrar
      </router-link>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  familyName: '',
})

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

async function onSubmit() {
  loading.value = true
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      familyName: form.familyName,
    })
    $q.notify({
      type: 'positive',
      message: 'Conta criada com sucesso!',
    })
    router.push('/dashboard')
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: { message?: string } } } }
    const message =
      err.response?.data?.error?.message || 'Erro ao criar conta. Tente novamente.'
    $q.notify({
      type: 'negative',
      message,
    })
  } finally {
    loading.value = false
  }
}
</script>
