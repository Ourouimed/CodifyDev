"use client";
import { addToast, removeToast } from "@/store/features/toast/toastSlice";
import { useDispatch } from "react-redux"

export const useToast = () => {
    const dispatch = useDispatch()
    return {
        success: (message) => {
            dispatch(addToast({message , type : 'success'}))

            setTimeout(()=>{
                dispatch(removeToast(0))
            }, 3000)
        },
        error: (message) => {
            dispatch(addToast({message , type : 'error'}))

            setTimeout(()=>{
                dispatch(removeToast(0))
            }, 3000)
        },
        warning: (message) => {
            dispatch(addToast({message , type : 'warning'}))

            setTimeout(()=>{
                dispatch(removeToast(0))
            }, 3000)
        },
        info: (message) => {
            dispatch(addToast({message , type : 'info'}))

            setTimeout(()=>{
                dispatch(removeToast(0))
            }, 3000)
        },
        removeToast: (index) => {
            dispatch(removeToast(index))
        }
    }
}