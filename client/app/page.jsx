'use client'
import { useAuth } from "@/hooks/useAuth";
import { verifySession } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Home = ()=>{
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
  return <h1> Welcome home</h1>
}

export default Home 