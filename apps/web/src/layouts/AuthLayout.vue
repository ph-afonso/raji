<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="flex flex-center" :class="bgClass">
        <div class="auth-container full-width q-px-md" style="max-width: 440px">
          <!-- Logo -->
          <div class="text-center q-mb-xl">
            <q-icon
              name="account_balance_wallet"
              size="64px"
              color="primary"
            />
            <h4 class="text-h4 text-weight-bold q-mt-md q-mb-none text-primary">
              Raji Finance
            </h4>
            <p class="text-subtitle1 text-grey">
              Gestao financeira pessoal inteligente
            </p>
          </div>

          <!-- Content slot -->
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const bgClass = computed(() =>
  $q.dark.isActive ? 'bg-dark-page' : 'bg-grey-2',
)
</script>

<style lang="scss" scoped>
.auth-container {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
