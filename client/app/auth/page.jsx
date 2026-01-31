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
            router.push('/')
        }
  }, [user, router]);

    const handleSwitchMode = (mode)=>{
        setAuthMode(mode)
    }
    return <section className="bg-background px-6 md:px-20 py-20 min-h-screen flex justify-center items-center">
        <div className="grid grid-cols md:grid-cols-5 gap-4 max-w-7xl w-full items-center">
            <div className="space-y-6 col-span-3">
               <Badge text={'Join our dev community'} icon={Terminal}/>
               <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold">
                    Connect with <span className="text-primary ">Developers</span>. Build Together.
                </h1>

                <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                    Join a community of passionate developers where collaboration, knowledge sharing, and mutual support are at the core. Learn, build, and grow together.
                </p>
            </div>

            <div className="col-span-2 bg-background p-4 rounded-lg border border-border space-y-6">
                <div className="border border-border p-2 rounded-md flex items-center gap-2 w-[350px] max-w-full mx-auto">
                    
                    <Button variant={authMode === 'login' ? 'DEFAULT' : 'TRANSPARENT'} onClick={()=> handleSwitchMode('login')} className='justify-center flex-1'>
                        Login
                    </Button>
                    <Button variant={authMode === 'register' ? 'DEFAULT' : 'TRANSPARENT'} onClick={()=> handleSwitchMode('register')} className='justify-center flex-1'>
                        Register
                    </Button>
                </div>

                {authMode === 'login' ? <LoginForm/> : <RegisterForm onRegisterSuccess={()=> handleSwitchMode('login')}/>}
            </div>

            
        </div>
    </section>
}

export default Auth