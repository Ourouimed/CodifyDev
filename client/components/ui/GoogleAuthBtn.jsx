import { GoogleIcon } from "../icons/Google";
import { Button } from "./Button";

export const GoogleAuthBtn = ({variant = 'DEFAULT'})=>{
    return <Button className='w-full justify-center' variant={variant} onClick={()=>{
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`
    }}>
        <GoogleIcon className="mr-2 h-4 w-4"/> Continue with GitHub
    </Button> 
}