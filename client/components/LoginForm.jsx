import { Github, Loader2, Lock, Mail } from "lucide-react"
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

const LoginForm = ()=>{
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
                    router.push('/')
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
    return <div className="space-y-4">
        <h2 className="font-semibold text-xl">Welcome back</h2>

        <div className="space-y-2">
            <label className="text-xs uppercase" htmlFor="email">
                Email
            </label>
            <Input id='email' placeholder="example@email.com" value={loginForm.email} icon={Mail} onChange={handleChange}/>
            {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
        </div>



        <div className="space-y-2">
            <label className="text-xs uppercase" htmlFor='password'>
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
        <div className="space-y-2">
            <Button className='w-full justify-center'>
                <Github className="mr-2 h-4 w-4"/> Continue with GitHub
            </Button> 


            <Button className='w-full justify-center' variant="outline">
                <GoogleIcon className="mr-2 h-4 w-4"/> Continue with Google
            </Button> 
        </div>
    </div>
}

export default LoginForm