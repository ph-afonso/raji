import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import vPerm from '../v-perm';
import { useRbacStore } from 'src/stores/rbac.store';
import type { Permission } from 'src/types/auth';

const mockPermissions: Permission[] = [
  { module: 'transactions', action: 'create' },
  { module: 'groups', action: 'read' },
];

describe('v-perm directive', () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    const rbacStore = useRbacStore();
    rbacStore.loadPermissions(mockPermissions);
  });

  describe('modo hide (default)', () => {
    it('deve manter elemento visivel quando tem permissao', () => {
      const TestComp = defineComponent({
        directives: { perm: vPerm },
        template: `<button id="test-el" v-perm="'transactions:create'">content</button>`,
      });

      const wrapper = mount(TestComp, {
        global: { plugins: [pinia] },
      });

      const el = wrapper.find('#test-el');
      expect(el.element.style.display).not.toBe('none');
    });

    it('deve esconder elemento quando nao tem permissao', () => {
      const TestComp = defineComponent({
        directives: { perm: vPerm },
        template: `<button id="test-el" v-perm="'billing:manage'">content</button>`,
      });

      const wrapper = mount(TestComp, {
        global: { plugins: [pinia] },
      });

      const el = wrapper.find('#test-el');
      expect(el.element.style.display).toBe('none');
    });
  });

  describe('modo disable (v-perm:disable)', () => {
    it('deve desabilitar elemento e reduzir opacidade quando nao tem permissao', () => {
      const TestComp = defineComponent({
        directives: { perm: vPerm },
        template: `<button id="test-el" v-perm:disable="'billing:manage'">content</button>`,
      });

      const wrapper = mount(TestComp, {
        global: { plugins: [pinia] },
      });

      const el = wrapper.find('#test-el');
      expect(el.attributes('disabled')).toBe('true');
      expect(el.element.style.opacity).toBe('0.5');
    });

    it('deve manter elemento habilitado quando tem permissao', () => {
      const TestComp = defineComponent({
        directives: { perm: vPerm },
        template: `<button id="test-el" v-perm:disable="'transactions:create'">content</button>`,
      });

      const wrapper = mount(TestComp, {
        global: { plugins: [pinia] },
      });

      const el = wrapper.find('#test-el');
      expect(el.attributes('disabled')).toBeUndefined();
      expect(el.element.style.opacity).not.toBe('0.5');
    });
  });
});
