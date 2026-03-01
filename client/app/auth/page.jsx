'use client'
import { Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import { verifySession } from "@/store/features/auth/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const Auth = ()=>{
    const [authMode , setAuthMode] = useState('login')
    const dispatch = useDispatch()
    const router = useRouter()
    const { user , isInitialized } = useAuth()

      useEffect(() => {
        dispatch(verifySession());
      }, [dispatch]);


      useEffect(() => {
        if (user && isInitialized) {
            router.push('/feed')
        }
  }, [user, router]);


    return <section className="min-h-screen flex justify-center items-center p-4">
        {authMode === 'login' ? <LoginForm goToRegister={()=> setAuthMode('register')}/> : <RegisterForm goToLogin={()=> setAuthMode('login')}/>}
    </section>
}

export default Auth