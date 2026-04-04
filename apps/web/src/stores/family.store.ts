import { defineStore } from 'pinia';
import { ref } from 'vue';
import familiesService from 'src/services/families.service';
import type { Family, FamilyMember } from 'src/services/families.service';

export const useFamilyStore = defineStore('family', () => {
  // State
  const family = ref<Family | null>(null);
  const members = ref<FamilyMember[]>([]);
  const loadingFamily = ref(false);
  const loadingMembers = ref(false);

  // Actions
  async function loadFamily() {
    loadingFamily.value = true;
    try {
      const response = await familiesService.getMyFamily();
      family.value = response.data;
    } finally {
      loadingFamily.value = false;
    }
  }

  async function loadMembers() {
    loadingMembers.value = true;
    try {
      const response = await familiesService.listMembers();
      members.value = response.data;
    } finally {
      loadingMembers.value = false;
    }
  }

  async function updateFamily(name: string) {
    const response = await familiesService.updateMyFamily({ name });
    family.value = response.data;
    return response.data;
  }

  function clear() {
    family.value = null;
    members.value = [];
  }

  return {
    family,
    members,
    loadingFamily,
    loadingMembers,
    loadFamily,
    loadMembers,
    updateFamily,
    clear,
  };
});
