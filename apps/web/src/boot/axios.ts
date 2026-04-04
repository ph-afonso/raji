import { boot } from 'quasar/wrappers'
import type { AxiosInstance } from 'axios'
import { api } from 'src/services/api'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
