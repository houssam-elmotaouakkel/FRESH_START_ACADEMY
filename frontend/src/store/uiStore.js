import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set) => ({
      // Sidebar admin
      mobileSidebarOpen: false,
      desktopSidebarPinned: true,
      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
      toggleDesktopSidebarPinned: () =>
        set((state) => ({ desktopSidebarPinned: !state.desktopSidebarPinned })),
      setDesktopSidebarPinned: (value) =>
        set({ desktopSidebarPinned: Boolean(value) }),

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
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        desktopSidebarPinned: state.desktopSidebarPinned,
      }),
    }
  )
);

export default useUiStore;
