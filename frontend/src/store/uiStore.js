import { create } from 'zustand';

const useUiStore = create((set) => ({
  // Sidebar admin
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Modal
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  openModal: (type, data = null) =>
    set({ modal: { isOpen: true, type, data } }),
  closeModal: () =>
    set({ modal: { isOpen: false, type: null, data: null } }),

  // Loading global
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));

export default useUiStore;