import { useSelector } from "react-redux"

export const useEvent = ()=>{
    return useSelector(state => state.event)
}