const { createSlice } = require("@reduxjs/toolkit");

export const toastSlice = createSlice({
    name : "toast" , 
    initialState : {
        toasts : []
    },
    reducers : {
        addToast : (state , action)=>{
            state.toasts.push(action.payload)
        },
        removeToast : (state , action)=>{
            state.toasts = state.toasts.filter((e , i)=> i !== action.payload)
        }
    }
})

export const { addToast , removeToast} = toastSlice.actions

export default toastSlice.reducer