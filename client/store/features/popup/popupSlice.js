import { createSlice } from "@reduxjs/toolkit"

export const PopupSlice = createSlice({
    name: 'popup',
    initialState: {
        title: '',
        isOpen: false,
        component: null,     
        props: {}           
    },
    reducers: {
        openPopup: (state, action) => {
            const { title, component, props } = action.payload
            state.isOpen = true
            state.title = title
            state.component = component
            state.props = props || {}
        },
        closePopup: (state) => {
            state.isOpen = false
            state.title = ""
            state.component = null
            state.props = {}
        }
    }
})

export const { openPopup, closePopup } = PopupSlice.actions
export default PopupSlice.reducer