import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import eventsService from "./eventsService";


export const createEvent = createAsyncThunk('event/create' , async (event , thunkAPI)=>{
    try {
        return await eventsService.create(event)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})



export const getEvents = createAsyncThunk('events/getAll' , async (_ , thunkAPI)=>{
    try {
    return await eventsService.get()
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const joinEvent = createAsyncThunk('events/join' , async (eventId , thunkAPI)=>{
    try {
        return await eventsService.join(eventId)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})


export const accept_attendee = createAsyncThunk('events/accept_attendee' , async ({eventId , userId} , thunkAPI)=>{
    try {
        return await eventsService.accept_attendee(eventId , userId)
    }
    catch (err){
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const deleteEvent = createAsyncThunk('events/delete' , async (eventId , thunkAPI)=>{
    try {
        return await eventsService.deleteEvent(eventId)
    }
    catch (err){
        return thunkAPI.rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
})

export const eventSlice = createSlice({
    name : 'event' , 
    initialState : {
        isLoading : false ,
        isJoining : false ,
        isAccepting : false,
        events : {}
    },


    extraReducers : builder => builder
    // create new event
    .addCase(createEvent.pending , (state , action)=>{
        state.isLoading= true
    })
    .addCase(createEvent.fulfilled , (state , action)=>{
        state.isLoading= false
        state.events = {...state.events , uppcomming : [action.payload.event , ... state.events.uppcomming]}
    })
    .addCase(createEvent.rejected , (state , action)=>{
        state.isLoading= false
    })



   // GET ALL EVENTS
    .addCase(getEvents.pending , (state)=>{
        state.isLoading= true
    })
    .addCase(getEvents.fulfilled , (state , action)=>{
        state.isLoading= false
        console.log(action.payload.events)
        state.events = action.payload.events
    })
    .addCase(getEvents.rejected , (state )=>{
        state.isLoading= false
    }) 

    // join an event 
    .addCase(joinEvent.pending , (state)=>{
        state.isJoining= true
    })
    .addCase(joinEvent.fulfilled , (state , action)=>{
        state.isJoining= false
    })
    .addCase(joinEvent.rejected , (state )=>{
        state.isJoining= false
    })


    // accepot an attenddee 
    .addCase(accept_attendee.pending , (state)=>{
        state.isAccepting= true
    })
    .addCase(accept_attendee.fulfilled , (state , action)=>{
        state.isAccepting= false
    })
    .addCase(accept_attendee.rejected , (state )=>{
        state.isAccepting= false
    })


     // delete event 
    .addCase(deleteEvent.pending , (state)=>{
        state.isLoading = true
    })
    .addCase(deleteEvent.fulfilled , (state , action)=>{
        state.isLoading = false
    })
    .addCase(deleteEvent.rejected , (state , action)=>{
        state.isLoading = false
    })
})


export default eventSlice.reducer