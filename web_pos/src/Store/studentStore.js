import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const studentStore = create()(
  persist(
    (set, get) => ({
      list: [],
      addStudent: (product) => set((state) => ({
        list:[...state.list, product]
      })),

      onUpdate: (id, updateData) => set((state) => ({
        list: state.list.map((item) => 
            item.id === id ? {...item, ...updateData} : item
        )
      })),

      onDeletee: (id) => set((state) => ({
        list: state.list.filter((item) => item.id != id)
      }))
    }),
    {
      name: 'food-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
