'use client'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { resetPassword } from "@/store/features/auth/authSlice"
import { Loader2, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux"

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    
    const dispatch = useDispatch()
    const { isLoading } = useAuth()
    const router = useRouter()
    const toast = useToast()
    const searchParams = useSearchParams()
    
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    const handleResetPassword = async () => {
        setError('')
        
        // 1. Validation
        if (!password || password.length < 8) {
            return setError("Password must be at least 8 characters long")
        }
        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        }
        if (!token) {
            return toast.error("Invalid or missing reset token")
        }

        try {
            await dispatch(resetPassword({ token, password , email })).unwrap()
            toast.success('Password updated successfully!')
            
            // 3. Redirect to login
            setTimeout(() => {
                router.push('/auth')
            }, 1500)
        } catch (err) {
            toast.error(err || 'Failed to reset password. Link may be expired.')
        }
    }

    return (
        <section className="min-h-screen flex justify-center items-center p-4">
            <div className="space-y-4 border border-border rounded-xl shadow-xl p-5 w-md max-w-full">
                <div className="flex items-center justify-center flex-col">
                    <div className="bg-primary/10 border border-primary/20 size-16 rounded-2xl flex justify-center items-center">
                        <Lock className="text-primary" size={28} />
                    </div>

                    <div className="text-center space-y-2 mt-4">
                        <h3 className="text-2xl font-bold tracking-tight">Set new password</h3>
                        <p className="text-sm text-gray-400">
                            Your new password must be different from previously used passwords.
                        </p>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold" htmlFor="password">
                            New Password
                        </label>
                        <Input 
                            id='password' 
                            type="password"
                            placeholder="••••••••" 
                            value={password} 
                            icon={Lock} 
                            onChange={e => setPassword(e.target.value)}
                            />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <Input 
                            id='confirmPassword' 
                            type="password"
                            placeholder="••••••••" 
                            value={confirmPassword} 
                            icon={Lock} 
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-[10px] font-medium">{error}</p>}
                    </div>
                </div>

                <Button 
                    variant="primary" 
                    disabled={isLoading} 
                    className={`w-full justify-center mt-2 ${isLoading ? 'opacity-50' : ''}`} 
                    onClick={handleResetPassword}
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {isLoading ? 'Updating...' : 'Reset password'} 
                </Button>

                <Button 
                    href='/auth'
                    className="w-full justify-center"
                >
                    Back to login <ArrowLeft size={14}/>
                </Button>
            </div>
        </section>
    )
}

export default ResetPassword