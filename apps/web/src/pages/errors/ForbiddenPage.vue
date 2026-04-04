<template>
  <q-page class="flex flex-center">
    <div class="text-center q-pa-md">
      <div class="text-h1 text-weight-thin text-negative q-mb-md" style="opacity: 0.6">
        403
      </div>
      <h5 class="text-h5 q-mb-sm">Acesso negado</h5>
      <p class="text-body1 text-grey q-mb-lg">
        Voce nao tem permissao para acessar esta pagina.<br />
        Entre em contato com o administrador da sua familia.
      </p>
      <q-btn
        color="primary"
        label="Voltar ao inicio"
        icon="home"
        to="/dashboard"
        no-caps
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Error 403 — Forbidden
</script>
