import { AtSign, Github, Loader2, Lock, Mail, User } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Divider } from "./ui/Divider";
import { GoogleIcon } from "./icons/Google";
import { register } from "@/store/features/auth/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { useAuth } from "@/hooks/useAuth";

const RegisterForm = ({onRegisterSuccess}) => {
    const [registerForm, setRegisterForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPass: ''
    });

   
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const { isLoading } = useAuth()

    const validateForm = () => {
        const newErrors = {};
        
        // Name Validation
        if (!registerForm.name.trim()) newErrors.name = "Full name is required";
        
        // Username Validation
        if (registerForm.username.length < 3) newErrors.username = "Username must be at least 3 characters";
        
        // Email Validation (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerForm.email)) newErrors.email = "Please enter a valid email address";
        
        // Password Validation
        if (registerForm.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        
        // Confirm Password Validation
        if (registerForm.password !== registerForm.confirmPass) {
            newErrors.confirmPass = "Passwords do not match";
        }

        setErrors(newErrors);
        // Returns true if the errors object is empty
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            try {
                await dispatch(register(registerForm)).unwrap();
                onRegisterSuccess()
            } catch (err) {
               console.log(err)
            }
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [id]: value }));
        
        // Optional: Clear error as user types
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <h2 className="font-semibold text-xl">Create Account</h2>
                <p className="text-sm">
                    Join <span className="text-primary font-semibold">CodifyDev</span> community now
                </p>
            </div>

            {/* Main Form Container */}
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                    {/* Name Field */}
                    <div className="space-y-1 flex-1">
                        <label className="text-xs uppercase font-medium" htmlFor="name">Full Name</label>
                        <Input value={registerForm.name} id='name' placeholder="John Doe" icon={User} onChange={handleChange} />
                        {errors.name && <p className="text-red-500 text-[10px]">{errors.name}</p>}
                    </div>

                    {/* Username Field */}
                    <div className="space-y-1 flex-1">
                        <label className="text-xs uppercase font-medium" htmlFor="username">Username</label>
                        <Input value={registerForm.username} id='username' placeholder="johndoe123" icon={AtSign} onChange={handleChange} />
                        {errors.username && <p className="text-red-500 text-[10px]">{errors.username}</p>}
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                    <label className="text-xs uppercase font-medium" htmlFor="email">Email</label>
                    <Input value={registerForm.email} id='email' type="email" placeholder="example@email.com" icon={Mail} onChange={handleChange} />
                    {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <label className="text-xs uppercase font-medium" htmlFor='password'>Password</label>
                    <Input id='password' value={registerForm.password} type="password" placeholder='••••••••' icon={Lock} onChange={handleChange} />
                    {errors.password && <p className="text-red-500 text-[10px]">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                    <label className="text-xs uppercase font-medium" htmlFor='confirmPass'>Confirm Password</label>
                    <Input value={registerForm.confirmPass} id='confirmPass' type="password" placeholder='••••••••' icon={Lock} onChange={handleChange} />
                    {errors.confirmPass && <p className="text-red-500 text-[10px]">{errors.confirmPass}</p>}
                </div>
            </div>


            <Button disabled={isLoading} variant="primary" className={`w-full justify-center ${isLoading && 'opacity-50'}`} onClick={handleRegister}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                {isLoading ? 'Registering...' : 'Register now'}
            </Button>

            <Divider>Or Continue with</Divider>

            <div className="space-y-2">
                <Button className='w-full justify-center'>
                    <Github className="mr-2 h-4 w-4" /> Continue with GitHub
                </Button>
                <Button className='w-full justify-center' variant="outline">
                    <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
                </Button>
            </div>
        </div>
    );
};


export default RegisterForm