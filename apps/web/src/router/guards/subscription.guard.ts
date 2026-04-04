import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Subscription guard — placeholder for Sprint 4.
 * Currently always allows access. Will check subscription status
 * when billing module is implemented.
 */
export function subscriptionGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  // TODO: Sprint 4 — verify subscription is active
  // const billingStore = useBillingStore()
  // if (to.meta.requiresSubscription && !billingStore.isActive) {
  //   next('/paywall')
  //   return
  // }

  next()
}
