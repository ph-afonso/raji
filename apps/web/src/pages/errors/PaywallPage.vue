<template>
  <q-page class="flex flex-center">
    <div class="text-center q-pa-md" style="max-width: 480px">
      <q-icon name="credit_card_off" size="80px" color="warning" class="q-mb-md" />
      <h5 class="text-h5 q-mb-sm">Assinatura necessaria</h5>
      <p class="text-body1 text-grey q-mb-lg">
        Sua assinatura esta inativa ou expirou.
        Para continuar utilizando o Raji Finance, ative ou renove seu plano.
      </p>
      <div class="q-gutter-sm">
        <q-btn
          color="primary"
          label="Ver planos"
          icon="shopping_cart"
          to="/subscription"
          no-caps
        />
        <q-btn
          flat
          color="grey"
          label="Voltar ao inicio"
          icon="home"
          to="/dashboard"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Paywall — Subscription inactive
</script>
