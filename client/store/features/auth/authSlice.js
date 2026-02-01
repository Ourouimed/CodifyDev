import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

export const register = createAsyncThunk('auth/register' , async (user , thunkAPI)=>{
    try {
        console.log('Hello')
        return await authService.register(user)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const loginUser = createAsyncThunk('auth/login' , async (user , thunkAPI)=>{
  try {
    return await authService.login(user)
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})

export const logout = createAsyncThunk('auth/logout' , async (_ , thunkAPI)=>{
  try {
    return await authService.logout()
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})


export const update = createAsyncThunk('auth/profile/update' , async (user , thunkAPI)=>{
    try {
        return await authService.updateProfile(user)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})




export const verifySession = createAsyncThunk('auth/verify-session' , async (_ , thunkAPI)=>{
  try {
    return await authService.verifySession()
  }
  catch (err){
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
})

export const authSlice = createSlice({
    name : 'auth' ,
    initialState : {
        user : null , 
        isLoading : false  ,
        isInitialized: false
    },


    extraReducers : builder => builder
    // register
    .addCase(register.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(register.fulfilled , (state , action)=>{
        state.isLoading = false
        console.log(action.payload)
    })
    .addCase(register.rejected , (state , action)=>{
        state.isLoading = false
        console.log(action.payload)
        
    })


    // Login 
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user
      console.log(action.payload)
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null
    })



    // update  
    .addCase(update.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(update.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user
      console.log(action.payload)
    })
    .addCase(update.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null
    })
    


    // verify Session
    .addCase(verifySession.pending, (state) => {
      state.isLoading = true
    })
    .addCase(verifySession.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload)
      state.user = action.payload.user
      state.isInitialized = true;
    })
    .addCase(verifySession.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null
      state.isInitialized = true;
      console.log(action.payload)
    })


        // Log out 
    .addCase(logout.pending, (state) => {
      state.isLoading = true
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload)
      state.user = null
    })
    .addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null
    })
})


export default authSlice.reducer