import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  size?: string;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  toggleCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId &&
                   (item.size ? i.size === item.size : true)
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + (item.quantity || 1);
            if (newQuantity > item.stock) {
              toast.error(`Only ${item.stock} items available in stock`);
              return state;
            }

            toast.success('Cart updated!');
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                (item.size ? i.size === item.size : true)
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }

          if ((item.quantity || 1) > item.stock) {
            toast.error(`Only ${item.stock} items available in stock`);
            return state;
          }

          toast.success('Added to cart!');
          return {
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && (!size || i.size === size))
          ),
        }));
        toast.success('Item removed from cart');
      },

      updateQuantity: (productId, quantity, size) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && (!size || i.size === size))
              ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.productId === productId && (!size || i.size === size)
                ? { ...i, quantity }
                : i
            ),
          };
        });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),
      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.originalPrice || item.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const total = get().getTotal();
        return subtotal - total;
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
