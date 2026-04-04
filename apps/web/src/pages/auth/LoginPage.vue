<template>
  <q-card flat bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6 text-center q-mb-md">Entrar</div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
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

        <div>
          <q-btn
            type="submit"
            label="Entrar"
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
      <router-link to="/forgot-password" class="text-primary text-caption">
        Esqueci minha senha
      </router-link>
      <div class="q-mt-md">
        <span class="text-grey">Nao tem conta? </span>
        <router-link to="/register" class="text-primary text-weight-bold">
          Criar conta
        </router-link>
      </div>
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
  email: '',
  password: '',
})

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

async function onSubmit() {
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!',
    })
    router.push('/dashboard')
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: { message?: string } } } }
    const message =
      err.response?.data?.error?.message || 'Erro ao fazer login. Verifique suas credenciais.'
    $q.notify({
      type: 'negative',
      message,
    })
  } finally {
    loading.value = false
  }
}
</script>
