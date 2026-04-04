'use client'
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { resendOtp, verifyOtp } from "@/store/features/auth/authSlice"
import { Check, Loader2, Mail, RefreshCcw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"

const Otp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""))
    const [err , setErr] = useState('')
    const [timer , setTimer ] = useState(60)
    const inputRefs = useRef([])
    const params = useSearchParams()
    const email = params.get('email')

    const dispatch = useDispatch()
    const { isLoading } = useAuth()

    const router = useRouter()
    const toast = useToast()
    

    

    useEffect(()=>{
        const resendTimer = setInterval(()=>{
          setTimer(prev => {
            if (prev > 0) return prev - 1;
            clearInterval(resendTimer); 
            return 0;
        });
            
        }, 1000 )

        return ()=> clearInterval(resendTimer)
    } , [])
    

    useEffect(() => {
        const codeParam = params.get('code')
        if (codeParam) {
            const codeArray = codeParam.slice(0, 6).split('')
            setOtp(codeArray)
        }
    }, [params]) 


    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])


    const handleVerifyOtp = async ()=>{
        if (otp.join('').length < 6 || isNaN(otp.join(''))) return setErr('Please provider a valid otp format')
        try {
            setErr('')
            await dispatch(verifyOtp({otp : otp.join('') , email})).unwrap();
            toast.success('Email verified successfully')
            setTimeout(()=>{
                router.push('/auth')
            }, 1000)
        }
        catch (err){
            toast.error(err || 'An errror ....')
        }
    }

    const handleResendOtp = async ()=>{
        try {
            await dispatch(resendOtp(email)).unwrap();
            setTimer(60)
            toast.success('otp sent successfully')
        }
        catch (err){
            toast.error(err || 'An errror ....')
        }
    }

    const handleChange = (e, index) => {
        const value = e.target.value
        if (isNaN(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault() // stop the browser from inserting pasted text

        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        const newOtp = [...otp]

        for (let i = 0; i < pasteData.length; i++) {
            newOtp[i] = pasteData[i]
        }

        setOtp(newOtp)

        // Focus next empty input
        const firstEmptyIndex = newOtp.findIndex(val => val === "")
        if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
            inputRefs.current[firstEmptyIndex].focus()
        } else if (inputRefs.current[5]) {
            inputRefs.current[5].focus() // last input
        }
    }

    return (
        <section className="min-h-screen flex justify-center items-center p-4">
            <div className="space-y-4 border border-border rounded-xl shadow-xl p-5 w-md">
                <div className="flex items-center justify-center flex-col">
                    <div className="bg-primary/10 border border-primary/20 size-16 rounded-2xl flex justify-center items-center">
                        <Mail className="text-primary" size={28} />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight">Verify your email</h3>
                        <p className="text-sm text-gray-400">
                            We sent a 6-digit code to <span className="font-semibold text-gray-200">{email ? email : 'test@test.com'}</span>
                        </p>
                    </div>
                </div>


                <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            ref={(el) => (inputRefs.current[i] = el)}
                            value={digit}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={handlePaste}
                            className="w-12 h-14 text-center text-xl font-bold border border-border bg-border/30 rounded-lg focus:border-primary outline-none transition-all"
                        />
                    ))}
                </div>
                {err && <p className="text-[10px] text-red-500 mt-2 text-center">{err}</p>}
            
            <div className="space-y-2">
                <Button variant="primary" disabled={isLoading} className={`w-full justify-center ${isLoading ? 'opacity-50' : ''}`} onClick={handleVerifyOtp}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Check size={14}/>}
                {isLoading ? 'Verifying...' : 'Verify otp'} 
                </Button>

                <Button disabled={isLoading || timer > 0} className={`w-full justify-center ${timer > 0 || isLoading ? 'opacity-50' : ''}`} onClick={handleResendOtp} >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <RefreshCcw size={14}/>}
                    {isLoading ? 'Resending...' : `Resend otp ${timer > 0 ? `in ${timer}s` : 'Now'} `} 
                    
                </Button>
            </div>
                
            </div>
        </section>
    )
}

export default Otp