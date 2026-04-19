import { useSelector } from "react-redux"

export const useCommunity = ()=>{
    return useSelector(state => state.community)
}