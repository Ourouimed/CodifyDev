import { configureStore } from "@reduxjs/toolkit"
import authReducer from './features/auth/authSlice'
import toastReducer from './features/toast/toastSlice'
import popupReducer from './features/popup/popupSlice'
import postReducer from './features/posts/postSlice'
import langReducer from './features/lang/langSlice'
import eventReducer from './features/events/eventsSlice'
import communityReducer from './features/communities/communitySlice'


export const store = configureStore({
    reducer : {
        auth : authReducer ,
        toast : toastReducer ,
        popup : popupReducer ,
        post : postReducer , 
        lang : langReducer ,
        event : eventReducer ,
        community : communityReducer ,
    }
})


