import { Github, Loader2, Lock, Mail, Terminal } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Divider } from "./ui/Divider"
import { GoogleIcon } from "./icons/Google"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { loginUser } from "@/store/features/auth/authSlice"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { GithubAuthBtn } from "./ui/GithubAuthBtn"
import { GoogleAuthBtn } from "./ui/GoogleAuthBtn"

const LoginForm = ({goToRegister})=>{
    const dispatch = useDispatch()
    const toast = useToast()
    const { isLoading } = useAuth()
    const router = useRouter()
    const [loginForm , setLoginForm] = useState({
        email : '' ,
        password : ''
    })
    const [errors , setErrors] = useState({})

    const validateForm = () => {
            const newErrors = {};
            // Email Validation (Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(loginForm.email)) newErrors.email = "Please enter a valid email address";
            
            // Password Validation
            if (loginForm.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        
    
            setErrors(newErrors);
            // Returns true if the errors object is empty
            return Object.keys(newErrors).length === 0;
        };
    
        const handleLogin = async () => {
            if (validateForm()) {
                try {
                    await dispatch(loginUser(loginForm)).unwrap();
                    toast.success('Login successfull')
                    router.push('/feed')
                } catch (err) {
                   console.log(err)
                   toast.error(err)
                }
            }
        };

    const handleChange = (e)=>{
        const { id , value } = e.target
        setLoginForm(prev => ({...prev , [id] : value}))
    }
    return <div className="space-y-4 border border-border rounded-lg shadow-xl p-5 w-md">
        <div className="flex justify-center flex-col items-center gap-1">
            <div className="bg-primary/30 size-16 rounded-full flex justify-center items-center">
                <Terminal className="text-primary font-bold size-8"/>
            </div>
            <h2 className="font-bold text-2xl">Welcome back</h2>
            <p className="text-sm text-gray-500">
                Enter your email to sign in to your account
            </p>
        </div>
        

        <div className="space-y-2">
            <label className="text-xs font-semibold" htmlFor="email">
                Email
            </label>
            <Input id='email' placeholder="example@email.com" value={loginForm.email} icon={Mail} onChange={handleChange}/>
            {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
        </div>



        <div className="space-y-2">
            <label className="text-xs font-semibold" htmlFor='password'>
                Password
            </label>
            <Input id='password' placeholder='password' value={loginForm.password} icon={Lock} onChange={handleChange}/>
            {errors.password && <p className="text-red-500 text-[10px]">{errors.password}</p>}
        </div>


          <Button disabled={isLoading} variant="primary" className={`w-full justify-center ${isLoading && 'opacity-50'}`} onClick={handleLogin}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                {isLoading ? 'Login in...' : 'Login now'}
            </Button>


       {/* Divider */}
        <Divider>
            Or Continue with
        </Divider>

        {/* Social login*/}
        <div className="gap-2 flex items-center ">    
            <GithubAuthBtn/>
            <GoogleAuthBtn variant='outline'/>
        </div>
        <p className="mt-3 text-center text-sm">
            Do not have an account ? <button className='text-primary cursor-pointer hover:underline' onClick={goToRegister}>Register</button>
        </p>
    </div>
}

export default LoginForm