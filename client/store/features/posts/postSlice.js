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

export const getSinglePost = createAsyncThunk('posts/getSingle', async (postId, thunkAPI) => {
    try {
        return await postService.getSinglePost(postId);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
});



export const likePost = createAsyncThunk('posts/like' , async (postId , thunkAPI)=>{
    try {
        return await postService.likePost(postId)
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

    reducers : {
        toggleLikePost : (state , action)=>{
            const postId = action.payload
            const postIndex = state.posts.findIndex(post => post._id === postId)    
            if (postIndex !== -1){
                const post = state.posts[postIndex] 
                if (post.isLiked){
                    post.likes = post.likes.filter(id => id !== postId)
                    post.likeCount -= 1
                }       
                else {
                    post.likes.push(postId)
                    post.likeCount += 1
                }
                post.isLiked = !post.isLiked
            }   
        }
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
    // get single post
    .addCase(getSinglePost.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(getSinglePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(p => p._id === action.payload.post._id);
        if (index !== -1) {
            state.posts[index] = action.payload.post;
        } else {
            state.posts.push(action.payload.post);
        }
    })
    .addCase(getSinglePost.rejected, (state) => {
        state.isLoading = false;
    })   
})

export const { toggleLikePost } = postSlice.actions
export default postSlice.reducer