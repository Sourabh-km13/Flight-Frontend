import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getRoleFromToken } from '../utils/authToken'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      setAuth: (user, token) =>
        set({
          user,
          token,
          role: getRoleFromToken(token),
        }),
      clearAuth: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: 'flight-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
      }),
    },
  ),
)

export default useAuthStore
