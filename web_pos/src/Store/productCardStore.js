import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const cartStore = create()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => set((state) => {
        const exist = state.cart.find((item) => item.id === product.id);

        if (exist) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            )
          };
        }

        return { cart: [...state.cart, { ...product, qty: 1 }] };
      }),

      decreaseQty: (id) => set((state) => {
        const exist = state.cart.find((item) => item.id === id);

        if (!exist) return { cart: state.cart };

        if (exist.qty === 1) {
          return { cart: state.cart.filter((item) => item.id !== id) };
        }

        return {
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, qty: item.qty - 1 } : item
          )
        };
      }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id)
        })),

      // ✅ NEW FUNCTION
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cartStore',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);





// import { create } from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware'

// export const cartStore = create()(
//   persist(
//     (set, get) => ({
//       cart: [],
//       addToCart: (product) => set((state) => {
//     const exist = state.cart.find((item) => item.id === product.id);

//     if(exist){
//       return{
//         cart: state.cart.map((item) =>
//           item.id === product.id ? {...item, qty:item.qty+1} : item
//         )
//       }
//     }
//     return {cart: [...state.cart, {...product, qty:1}]}
//   }),

//   decreaseQty: (id) => set((state) => {
//     const exist = state.cart.find((item) => item.id === id);

//     if(!exist) return {cart: state.cart}

//     if(exist.qty === 1){
//       return {cart: state.cart.filter((item) => item.id != id)}
//     }

//     return {
//       cart: state.cart.map((item) =>
//         item.id === id ? {...item, qty: item.qty-1} : item
//       )
//     }
//   }),

//   removeFromCart: (id) => set((state) => {
//     return {cart: state.cart.filter((item) => item.id != id)}
//   }),
//   clearCart: () => set({ cart: [] }),
//     }),
//     {
//       name: 'food-storage', // name of the item in the storage (must be unique)
//       storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
//     },
//   ),
// )