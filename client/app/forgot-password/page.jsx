'use client'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { sendResetLink } from "@/store/features/auth/authSlice"
import { Loader2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"

const ForgotPasssword = ()=>{
    const [email , setEmail] = useState('')
    const [error , setError] = useState('')
    const dispatch = useDispatch()
    const { isLoading } = useAuth()

    const router = useRouter()
    const toast = useToast()

    const handleSendResetLink = async ()=>{
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return setError("Please enter a valid email address")
            
            await dispatch(sendResetLink(email)).unwrap();
            toast.success('Reset instruction sent successfully')
            setTimeout(()=>{
                router.push('/auth')
            }, 1000)
        }
        catch (err){
            toast.error(err || 'An errror ....')
        }
    }
    return <section className="min-h-screen flex justify-center items-center p-4">
            <div className="space-y-4 border border-border rounded-xl shadow-xl p-5 w-md">
                <div className="flex items-center justify-center flex-col">
                    <div className="bg-primary/10 border border-primary/20 size-16 rounded-2xl flex justify-center items-center">
                        <Mail className="text-primary" size={28} />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight">Forgot your password</h3>
                        <p className="text-sm text-gray-400">
                            No worries! Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                        
                    </div>

                    
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold" htmlFor="email">
                        Email
                    </label>    
                    <Input id='email' placeholder="example@email.com" value={email} icon={Mail} onChange={e=> setEmail(e.target.value)}/>
                    {error && <p className="text-red-500 text-[10px]">{error}</p>}
                </div>
                <Button variant="primary" disabled={isLoading} className={`w-full justify-center ${isLoading ? 'opacity-50' : ''}`} onClick={handleSendResetLink}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Mail size={14}/>}
                    {isLoading ? 'Sending...' : 'Send reset link'} 
                </Button>
            </div>
        </section>
}

export default ForgotPasssword