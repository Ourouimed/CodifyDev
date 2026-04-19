import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import communityService from "./communityService";


export const createCommunity = createAsyncThunk('community/create' , async (community , thunkAPI)=>{
    try {
        return await communityService.create(community)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const getCommunities = createAsyncThunk('community/get' , async (_, thunkAPI)=>{
    try {
        return await communityService.get()
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

const CommunitySlice = createSlice({
    name: 'community',
    initialState: {
        communities: {},
        isLoading: false,
    },

    extraReducers : builder => builder
    // create new community
    .addCase(createCommunity.pending , (state , action)=>{
        state.isLoading= true
    })
    .addCase(createCommunity.fulfilled , (state , action)=>{
        state.isLoading= false
        state.communities = {...state.communities , Joined : [action.payload.community , ... state.communities.Joined]}
    })
    .addCase(createCommunity.rejected , (state , action)=>{
        state.isLoading= false
    })


    // GET ALL COMMUNITIES
    .addCase(getCommunities.pending , (state)=>{
        state.isLoading= true
    })
    .addCase(getCommunities.fulfilled , (state , action)=>{
        state.isLoading= false
        console.log(action.payload.communities)
        state.communities = action.payload.communities
    })
    .addCase(getCommunities.rejected , (state )=>{
        state.isLoading= false
    }) 
    
})

export default CommunitySlice.reducer