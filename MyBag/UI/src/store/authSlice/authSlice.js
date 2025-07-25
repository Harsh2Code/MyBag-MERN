import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_BASE_URL = 'https://mybag-server-mern.onrender.com';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    authChecked: false,
    user: null,
    role: null,
    error: null
}

export const registerUser = createAsyncThunk('auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const requestData = {
                name: formData.UserName,
                Email: formData.Email,
                password: formData.Password,
                role: formData.role
            };
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, requestData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const LoginUser = createAsyncThunk('auth/login',
    async (formData, { rejectWithValue }) => {
        try {
            const requestData = {
                Email: formData.Email,
                password: formData.password
            };
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, requestData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const LogoutUser = createAsyncThunk('auth/logout',
    async () => {
            const response = await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
            return response.data;
        } 
    
);

export const checkAuth = createAsyncThunk('auth/check-auth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/check-auth`, null, {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                }
            });
            // Add the following line to log the response data:
            console.log('checkAuth response:', response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return { success: false, user: null };
            }
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const refreshAuthToken = createAsyncThunk('auth/refresh-token',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, null, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        resetAuthState: (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.authChecked = false;
            state.user = null;
            state.role = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = action.payload.success || false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(LoginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success || false;
                state.error = null;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.authChecked = false;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.authChecked = true;
                state.user = action.payload.success ? action.payload.user : null;
                state.role = action.payload.user?.role || null;
                state.isAuthenticated = action.payload.success || false;
                state.error = null;
              })              
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.authChecked = true;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || action.error.message;
            }).addCase(LogoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(refreshAuthToken.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.success || false;
                state.user = action.payload.user || null;
                state.role = action.payload.user?.role || null;
            });
    }
});

export const { setUser, resetAuthState } = authSlice.actions;
export default authSlice.reducer;