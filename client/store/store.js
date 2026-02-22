import { configureStore } from "@reduxjs/toolkit"
import authReducer from './features/auth/authSlice'
import toastReducer from './features/toast/toastSlice'
import popupReducer from './features/popup/popupSlice'
import postReducer from './features/posts/postSlice'

export const store = configureStore({
    reducer : {
        auth : authReducer ,
        toast : toastReducer ,
        popup : popupReducer ,
        post : postReducer
    }
})


