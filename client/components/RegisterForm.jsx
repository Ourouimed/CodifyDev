'use client'
import { AtSign, Loader2, Lock, Mail, Terminal, User } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { register } from "@/store/features/auth/authSlice"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Divider } from "./ui/Divider"
import { GithubAuthBtn } from "./ui/GithubAuthBtn"
import { GoogleAuthBtn } from "./ui/GoogleAuthBtn"

const RegisterForm = ({ goToLogin }) => {
    const dispatch = useDispatch()
    const toast = useToast()
    const { isLoading } = useAuth()

    const [registerForm, setRegisterForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPass: ''
    })

    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!registerForm.name.trim()) newErrors.name = "Full name is required"
        if (registerForm.username.length < 3) newErrors.username = "Username must be at least 3 characters"
        if (!emailRegex.test(registerForm.email)) newErrors.email = "Please enter a valid email address"
        if (registerForm.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        if (registerForm.password !== registerForm.confirmPass) {
            newErrors.confirmPass = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRegister = async () => {
        if (validateForm()) {
            try {
                await dispatch(register(registerForm)).unwrap()
                toast.success('Account created successfully!')
                goToLogin()
            } catch (err) {
                toast.error(err || 'An error occurred during registration')
            }
        }
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setRegisterForm(prev => ({ ...prev, [id]: value }))
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }))
    }

    return (
        <div className="space-y-4 border border-border rounded-lg shadow-xl p-5 w-md animate-in fade-in duration-500">
            {/* Header / Branding */}
            <div className="flex justify-center flex-col items-center gap-1">
                <div className="bg-primary/30 size-16 rounded-full flex justify-center items-center">
                    <Terminal className="text-primary font-bold size-8" />
                </div>
                <h2 className="font-bold text-2xl tracking-tight">Create Account</h2>
                <p className="text-sm text-gray-500">
                    Join the <span className="text-primary font-semibold">CodifyDev</span> community
                </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
                <div className="flex gap-2">
                    {/* Name */}
                    <div className="space-y-1 flex-1">
                        <label className="text-xs font-semibold" htmlFor="name">Full Name</label>
                        <Input id='name' placeholder="John Doe" value={registerForm.name} icon={User} onChange={handleChange} />
                        {errors.name && <p className="text-red-500 text-[10px]">{errors.name}</p>}
                    </div>
                    {/* Username */}
                    <div className="space-y-1 flex-1">
                        <label className="text-xs font-semibold" htmlFor="username">Username</label>
                        <Input id='username' placeholder="johndoe" value={registerForm.username} icon={AtSign} onChange={handleChange} />
                        {errors.username && <p className="text-red-500 text-[10px]">{errors.username}</p>}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold" htmlFor="email">Email</label>
                    <Input id='email' type="email" placeholder="example@email.com" value={registerForm.email} icon={Mail} onChange={handleChange} />
                    {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold" htmlFor='password'>Password</label>
                    <Input id='password' type="password" placeholder='••••••••' value={registerForm.password} icon={Lock} onChange={handleChange} />
                    {errors.password && <p className="text-red-500 text-[10px]">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold" htmlFor='confirmPass'>Confirm Password</label>
                    <Input id='confirmPass' type="password" placeholder='••••••••' value={registerForm.confirmPass} icon={Lock} onChange={handleChange} />
                    {errors.confirmPass && <p className="text-red-500 text-[10px]">{errors.confirmPass}</p>}
                </div>
            </div>

            {/* Action Button */}
            <Button 
                disabled={isLoading} 
                variant="primary" 
                className={`w-full justify-center transition-all active:scale-[0.98] ${isLoading && 'opacity-50'}`} 
                onClick={handleRegister}
            >
                {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {isLoading ? 'Creating account...' : 'Register now'}
            </Button>

            <Divider>Or Continue with</Divider>

            {/* Social login*/}
            <div className="gap-2 flex items-center ">    
                <GithubAuthBtn/>
                <GoogleAuthBtn variant='outline'/>
            </div>

            <p className="mt-3 text-center text-sm">
                Already have an account?{' '}
                <button 
                    className='text-primary font-medium cursor-pointer hover:underline' 
                    onClick={goToLogin}
                >
                    Login
                </button>
            </p>
        </div>
    )
}

export default RegisterForm