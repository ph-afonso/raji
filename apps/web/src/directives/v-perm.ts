import type { Directive, DirectiveBinding } from 'vue'
import { useRbacStore } from 'src/stores/rbac.store'

const vPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    applyPermission(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    applyPermission(el, binding)
  },
}

function applyPermission(el: HTMLElement, binding: DirectiveBinding<string>) {
  const rbacStore = useRbacStore()
  const permission = binding.value

  if (!permission) return

  const hasAccess = rbacStore.hasPermission(permission)

  if (binding.arg === 'disable') {
    // v-perm:disable="'perm'" — disable the element
    if (!hasAccess) {
      el.setAttribute('disabled', 'true')
      el.style.opacity = '0.5'
      el.style.pointerEvents = 'none'
    } else {
      el.removeAttribute('disabled')
      el.style.opacity = ''
      el.style.pointerEvents = ''
    }
  } else {
    // v-perm="'perm'" — hide the element
    if (!hasAccess) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

export default vPerm
