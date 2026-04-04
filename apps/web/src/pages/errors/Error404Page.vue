<template>
  <q-page class="flex flex-center">
    <div class="text-center q-pa-md">
      <div class="text-h1 text-weight-thin text-primary q-mb-md" style="opacity: 0.6">
        404
      </div>
      <h5 class="text-h5 q-mb-sm">Pagina nao encontrada</h5>
      <p class="text-body1 text-grey q-mb-lg">
        A pagina que voce procura nao existe ou foi movida.
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
// Error 404 — Not Found
</script>
