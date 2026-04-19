import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('sv_cart') || '[]');

const persist = (items) => localStorage.setItem('sv_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: saved, isOpen: false },
  reducers: {
    addToCart(state, { payload }) {
      const existing = state.items.find(
        i => i._id === payload._id && i.selectedColor === payload.selectedColor && i.selectedSize === payload.selectedSize
      );
      if (existing) existing.qty = Math.min(existing.qty + (payload.qty || 1), payload.stock || 99);
      else state.items.push({ ...payload, qty: payload.qty || 1 });
      persist(state.items);
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter(i => !(i._id === payload._id && i.selectedColor === payload.selectedColor && i.selectedSize === payload.selectedSize));
      persist(state.items);
    },
    updateQty(state, { payload: { _id, selectedColor, selectedSize, qty } }) {
      const item = state.items.find(i => i._id === _id && i.selectedColor === selectedColor && i.selectedSize === selectedSize);
      if (item) { item.qty = qty; if (item.qty <= 0) state.items = state.items.filter(i => i !== item); }
      persist(state.items);
    },
    clearCart(state) { state.items = []; persist([]); },
    toggleCart(state) { state.isOpen = !state.isOpen; },
    openCart(state)   { state.isOpen = true; },
    closeCart(state)  { state.isOpen = false; },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;

export const selectCartTotal     = (state) => state.cart.items.reduce((s, i) => s + (i.discountPrice || i.price) * i.qty, 0);
export const selectCartItemCount = (state) => state.cart.items.reduce((s, i) => s + i.qty, 0);

export default cartSlice.reducer;
