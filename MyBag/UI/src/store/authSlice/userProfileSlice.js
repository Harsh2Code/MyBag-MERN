import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://mybag-server-mern.onrender.com';

const initialState = {
  userProfile: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching user profile');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('User profile data:', action.payload);
        if (action.payload && action.payload.user) {
          state.userProfile = action.payload.user;
          state.error = null;
        } else {
          state.userProfile = null;
          state.error = 'User profile data is empty or invalid';
          console.error('User profile data is empty or invalid:', action.payload);
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user profile';
        console.error('Failed to fetch user profile:', state.error);
      });
  },
});

export default userProfileSlice.reducer;
