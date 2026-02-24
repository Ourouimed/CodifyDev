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


export const getFollowingPosts = createAsyncThunk('posts/getFollowing' , async (post , thunkAPI)=>{
    try {
        return await postService.getFollowingPosts()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const getPostsByAuthor = createAsyncThunk('posts/getByAuthor' , async (authorId , thunkAPI)=>{
    try {
        return await postService.getPostsByAuthor(authorId)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const deletePost = createAsyncThunk('posts/delete' , async (postId , thunkAPI)=>{
    try {
        return await postService.deletePost(postId)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const postSlice = createSlice({
    name : 'post',
    initialState : {
        isLoading : false ,
        isPosting : false ,
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
        }, 
        updateFollowStatus : (state , action) => {
            const { username , isFollowing } = action.payload
            state.posts = state.posts.map(post => {
                if (post.author?.username === username){
                    return {
                        ...post,
                        isFollowing
                    }
                }
                return post
            })
        }
    },
    extraReducers : builder => builder
    // create post 
    .addCase(createPost.pending , (state)=>{
        state.isPosting = true
    })
    .addCase(createPost.fulfilled , (state , action)=>{
        state.isPosting = false
        state.posts.push(action.payload.post)
        console.log(action.payload)
    })
    .addCase(createPost.rejected , (state , action)=>{
        state.isPosting = false
        console.log(action.payload)
    })


     // delete post 
    .addCase(deletePost.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(deletePost.fulfilled , (state , action)=>{
        state.isLoading = false
        console.log(action.payload)
        state.posts = state.posts.filter(post => post._id !== action.payload.post._id)
        console.log(action.payload)
    })
    .addCase(deletePost.rejected , (state , action)=>{
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


    // get followings posts
    .addCase(getFollowingPosts.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(getFollowingPosts.fulfilled , (state , action)=>{
        state.isLoading = false
        state.posts= action.payload.posts
        console.log(action.payload)
    })
    .addCase(getFollowingPosts.rejected , (state , action)=>{
        state.isLoading = false
        console.log(action.payload)
    }) 



    // get posts by author
    .addCase(getPostsByAuthor.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(getPostsByAuthor.fulfilled , (state , action)=>{
        state.isLoading = false
        state.posts= action.payload.posts
        console.log(action.payload)
    })
    .addCase(getPostsByAuthor.rejected , (state , action)=>{
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

export const { toggleLikePost , updateFollowStatus } = postSlice.actions
export default postSlice.reducer