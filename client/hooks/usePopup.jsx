"use client";
import { closePopup, openPopup } from "@/store/features/popup/popupSlice"
import { useDispatch } from "react-redux"

export const usePopup = () => {
    const dispatch = useDispatch()
    return {
        openPopup: ({ title, component, props }) => {
            dispatch(openPopup({ title, component, props }))
        },
        closePopup: () => {
            dispatch(closePopup())
        }
    }
}