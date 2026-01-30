import { Github, Lock, Mail } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Divider } from "./ui/Divider"
import { GoogleIcon } from "./icons/Google"
import { useState } from "react"

const LoginForm = ()=>{
    const [loginForm , setLoginForm] = useState({
        email : '' ,
        password : ''
    })


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
            <Input id='email' placeholder="example@email.com" icon={Mail} onChange={handleChange}/>
        </div>



        <div className="space-y-2">
            <label className="text-xs uppercase" htmlFor='password'>
                Password
            </label>
            <Input id='password' placeholder='password' icon={Lock} onChange={handleChange}/>
        </div>


        <Button variant="primary" className={'w-full justify-center'}>
            Login
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