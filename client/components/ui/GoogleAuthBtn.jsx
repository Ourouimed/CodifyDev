import { GoogleIcon } from "../icons/Google";
import { Button } from "./Button";

export const GoogleAuthBtn = ({variant = 'DEFAULT'})=>{
    return <Button className='w-full justify-center' variant={variant} onClick={()=>{
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`
    }}>
        <GoogleIcon className="h-4 w-4"/> <span className="hidden md:block ">Continue with Google</span>
    </Button> 
}