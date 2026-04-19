import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem('sv_user') || 'null');

export const login = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/users/login', creds);
    localStorage.setItem('sv_user', JSON.stringify(data));
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const register = createAsyncThunk('auth/register', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/users/register', creds);
    localStorage.setItem('sv_user', JSON.stringify(data));
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Register failed'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('sv_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending,    (s) => { s.loading = true; s.error = null; })
     .addCase(login.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload; })
     .addCase(login.rejected,   (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(register.pending,   (s) => { s.loading = true; s.error = null; })
     .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
     .addCase(register.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
