import { useSelector } from "react-redux"

export const useLang = ()=>{
    return useSelector(state => state.lang)
}