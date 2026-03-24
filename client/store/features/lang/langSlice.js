const { createSlice, current } = require("@reduxjs/toolkit");

const langSlice = createSlice({
    name : 'lang' ,
    initialState : {
        currentLang : ''
    },
    reducers : {
        setCurrentLang : (state , action) =>{
            state.currentLang = action.payload
        }
    }
})

const { setCurrentLang } = langSlice.actions
export { setCurrentLang }
export default langSlice.reducer