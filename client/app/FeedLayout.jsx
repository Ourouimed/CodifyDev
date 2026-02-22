'use client'
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { logout, verifySession } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const FeedLayout = ({children})=>{
  const { isInitialized , user} = useAuth()
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
        if (!isInitialized) {
            dispatch(verifySession());
        }
    }, [dispatch, isInitialized]);

    useEffect(() => {
        if (!user && isInitialized) {
            router.push('/auth')
        };
    }, [user, isInitialized, router]);
  return <>
        <Header user={user} onLogout={()=>{
            dispatch(logout())
        }}/>

        <div className="relative grid grid-cols md:grid-cols-4 gap-4 px-6 md:px-20 py-5">
            <Sidebar/>
            <div className="md:col-span-3">
                {children}
            </div>
        </div>
  </>
}

export default FeedLayout 