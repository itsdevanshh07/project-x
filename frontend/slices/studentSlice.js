import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/student';

const initialState = {
    myCourses: [],
    cart: [],
    wishlist: [],
    orders: [],
    profile: null,
    stats: null,
    liveClasses: [],
    isLoading: false,
    isError: false,
    message: '',
};

// Get Student Profile
export const getProfile = createAsyncThunk('student/getProfile', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/profile`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Update Student Profile
export const updateProfile = createAsyncThunk('student/updateProfile', async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL}/profile`, userData, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Get My Courses
export const getMyCourses = createAsyncThunk('student/getMyCourses', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/my-courses`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Add to Cart
export const addToCart = createAsyncThunk('student/addToCart', async (item, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/cart`, item, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Remove from Cart
export const removeFromCart = createAsyncThunk('student/removeFromCart', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL}/cart/${id}`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Add to Wishlist
export const addToWishlist = createAsyncThunk('student/addToWishlist', async (item, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/wishlist`, item, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk('student/removeFromWishlist', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(`${API_URL}/wishlist/${id}`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Get Student Stats
export const getStudentStats = createAsyncThunk('student/getStats', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/stats`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Get Live Classes
export const getLiveClasses = createAsyncThunk('student/getLiveClasses', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/live-classes`, config);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => { state.isLoading = true; })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.cart = action.payload.cart || [];
                state.wishlist = action.payload.wishlist || [];
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(getMyCourses.fulfilled, (state, action) => {
                state.myCourses = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload;
            })
            .addCase(getStudentStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(getLiveClasses.fulfilled, (state, action) => {
                state.liveClasses = action.payload;
            });
    },
});

export const { reset } = studentSlice.actions;
export default studentSlice.reducer;
