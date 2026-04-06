import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import eventsService from "./eventsService";


export const createEvent = createAsyncThunk('event/create' , async (event , thunkAPI)=>{
    try {
    return await eventsService.create(event)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const eventSlice = createSlice({
    name : 'event' , 
    initialState : {
        isLoading : false ,
        events : []
    },


    extraReducers : builder => builder
    // create new event
    .addCase(createEvent.pending , (state , action)=>{
        state.isLoading= true
    })
    .addCase(createEvent.fulfilled , (state , action)=>{
        state.isLoading= false
        // state.events.push(action.payload.event)
    })
    .addCase(createEvent.rejected , (state , action)=>{
        state.isLoading= false
    })
})

export default eventSlice.reducer