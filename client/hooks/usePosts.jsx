import { useSelector } from "react-redux"

export const usePosts = ()=>{
    return useSelector(state => state.post)
}