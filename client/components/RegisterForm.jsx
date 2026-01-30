import { Github, Lock, Mail, User } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Divider } from "./ui/Divider"
import { GoogleIcon } from "./icons/Google"
import { useState } from "react"

const RegisterForm = () => {
    const [registerForm , setRegisterForm] = useState({
            name : '' ,
            username : '',
            email : '' ,
            password : '' ,
            confirmPass : ''
        })
    
    
        const handleChange = (e)=>{
            const { id , value } = e.target
            setRegisterForm(prev => ({...prev , [id] : value}))
        }
    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <h2 className="font-semibold text-xl">Create Account</h2>
                <p className="text-sm">
                    Join <span className="text-primary font-semibold">CodifyDev</span> community now
                </p>
            </div>

            
            <div className="flex items-center gap-2">
                {/* Name Field */}
                <div className="space-y-2">
                    <label className="text-xs uppercase font-medium" htmlFor="name">
                        Full Name
                    </label>
                    <Input id='name' placeholder="Enter your name" icon={User} onChange={handleChange}/>
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                    <label className="text-xs uppercase font-medium" htmlFor="username">
                        Username
                    </label>
                    <Input id='username' placeholder="Choose a username" icon={User} onChange={handleChange}/>
                </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-medium" htmlFor="email">
                    Email
                </label>
                <Input id='email' type="email" placeholder="example@email.com" icon={Mail} onChange={handleChange}/>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-medium" htmlFor='password'>
                    Password
                </label>
                <Input id='password' type="password" placeholder='••••••••' icon={Lock}/>
            </div>


            {/*Confirm Password Field */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-medium" htmlFor='confirmPass'>
                    Confirm Password
                </label>
                <Input id='confirmPass' type="password" placeholder='••••••••' icon={Lock} onChange={handleChange}/>
            </div>

            <Button variant="primary" className="w-full justify-center">
                Register now
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
    )
}

export default RegisterForm