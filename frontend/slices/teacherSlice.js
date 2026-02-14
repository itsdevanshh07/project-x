import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/teacher`
    : 'http://localhost:5000/api/teacher';

const initialState = {
    courses: [],
    liveClasses: [],
    doubts: [],
    stats: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

// Get Teacher Courses
export const getTeacherCourses = createAsyncThunk('teacher/getCourses', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/courses`, config);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Create Course
export const createCourse = createAsyncThunk('teacher/createCourse', async (courseData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/courses`, courseData, config);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Add Lesson
export const addLesson = createAsyncThunk('teacher/addLesson', async (lessonData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/lessons`, lessonData, config);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Schedule Live Class
export const scheduleLiveClass = createAsyncThunk('teacher/scheduleLive', async (liveData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.post(`${API_URL}/live-classes`, liveData, config);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Get Stats
export const getTeacherStats = createAsyncThunk('teacher/getStats', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/stats`, config);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTeacherCourses.pending, (state) => { state.isLoading = true; })
            .addCase(getTeacherCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload;
            })
            .addCase(getTeacherStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
            })
            .addCase(scheduleLiveClass.fulfilled, (state, action) => {
                state.liveClasses.push(action.payload);
            });
    }
});

export const { reset } = teacherSlice.actions;
export default teacherSlice.reducer;
