import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "./postService";


export const createPost = createAsyncThunk('posts/create' , async (post , thunkAPI)=>{
    try {
        return await postService.createPost(post)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const getAllPosts = createAsyncThunk('posts/getAll' , async (post , thunkAPI)=>{
    try {
        return await postService.getAll()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const postSlice = createSlice({
    name : 'post',
    initialState : {
        isLoading : false ,
        posts : []
    },


    extraReducers : builder => builder
    // create post 
    .addCase(createPost.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(createPost.fulfilled , (state , action)=>{
        state.isLoading = false
        state.posts.push(action.payload.post)
        console.log(action.payload)
    })
    .addCase(createPost.rejected , (state , action)=>{
        state.isLoading = false
        console.log(action.payload)
    })


    // get all post 
    .addCase(getAllPosts.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(getAllPosts.fulfilled , (state , action)=>{
        state.isLoading = false
        state.posts= action.payload.posts
        console.log(action.payload)
    })
    .addCase(getAllPosts.rejected , (state , action)=>{
        state.isLoading = false
        console.log(action.payload)
    })
})


export default postSlice.reducer