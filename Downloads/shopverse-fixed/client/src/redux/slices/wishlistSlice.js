import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('sv_wishlist') || '[]');

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: saved },
  reducers: {
    toggleWishlist(state, { payload }) {
      const idx = state.items.findIndex(i => i._id === payload._id);
      if (idx > -1) state.items.splice(idx, 1);
      else state.items.push(payload);
      localStorage.setItem('sv_wishlist', JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem('sv_wishlist');
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
