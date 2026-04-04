import { boot } from 'quasar/wrappers'
import vPerm from 'src/directives/v-perm'

export default boot(({ app }) => {
  // Register v-perm directive globally
  app.directive('perm', vPerm)
})
