import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    searchOpen: false,
    searchQuery: '',
    mobileMenuOpen: false,
    activeMood: null,
  },
  reducers: {
    setSearchOpen(state, { payload })  { state.searchOpen     = payload; },
    setSearchQuery(state, { payload }) { state.searchQuery    = payload; },
    setMobileMenu(state, { payload })  { state.mobileMenuOpen = payload; },
    setActiveMood(state, { payload })  { state.activeMood     = payload; },
  },
});

export const { setSearchOpen, setSearchQuery, setMobileMenu, setActiveMood } = uiSlice.actions;
export default uiSlice.reducer;
