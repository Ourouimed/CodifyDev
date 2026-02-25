"use client";
import { useSelector } from "react-redux"
import { Toast } from "./Toast";

export const ToastList = ()=>{
    const { toasts } = useSelector(state => state.toast)
    if (toasts.length === 0) return null;
    return <div className="fixed bottom-0 right-0 p-4 w-full max-w-sm space-y-2 z-100">
        {toasts.map((t ,i )=> <Toast id={i} key={i} type={t.type} message={t.message}/>)}
    </div>
}