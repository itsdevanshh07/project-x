import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth';

// Get user from localStorage
const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    teacherRequests: [],
    allUsers: [],
    allTeachers: [],
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Social Login (Google/Microsoft)
export const socialLogin = createAsyncThunk(
    'auth/socialLogin',
    async (payload, thunkAPI) => {
        try {
            const { idToken, provider, requiredRole } = payload;
            const config = {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            };
            const response = await axios.post(`${API_URL}/social`, { provider, requiredRole }, config);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            let message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            if (error.response?.data?.error) {
                message = `${message} (${error.response.data.error})`;
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
});

// Admin: Get Teacher Requests
export const getTeacherRequests = createAsyncThunk(
    'auth/getTeacherRequests',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/teacher-requests`, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Admin: Update Teacher Status
export const updateTeacherStatus = createAsyncThunk(
    'auth/updateTeacherStatus',
    async ({ id, status }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.put(`${API_URL}/approve-teacher/${id}`, { status }, config);
            return { id, status: response.data.teacher.status };
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Admin: Get All Users
export const getAllUsers = createAsyncThunk(
    'auth/getAllUsers',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/users`, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Admin: Get All Teachers
export const getAllTeachers = createAsyncThunk(
    'auth/getAllTeachers',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/teachers`, config);
            return response.data;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(socialLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(socialLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(socialLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(getTeacherRequests.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTeacherRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.teacherRequests = action.payload;
            })
            .addCase(getTeacherRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateTeacherStatus.fulfilled, (state, action) => {
                state.teacherRequests = state.teacherRequests.filter(req => req._id !== action.payload.id);
            })
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allUsers = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllTeachers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllTeachers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allTeachers = action.payload;
            })
            .addCase(getAllTeachers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
