import { createPinia } from 'pinia';
import type { Router } from 'vue-router';

// Será utilizado quando houver stores que precisem de roteamento
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default createPinia();
