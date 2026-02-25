'use client'

import SettingsLayout from "@/app/SettingsLayout"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"
import { AlertTriangle, Trash2, KeyRound, Mail, Info, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useToast } from "@/hooks/useToast"
import { setEmail as setEmailAction } from "@/store/features/auth/authSlice"
import { setPassword as setPasswordAction } from "@/store/features/auth/authSlice"
import { usePopup } from "@/hooks/usePopup"

const AccountPage = () => {
    const [email, setEmailAddress] = useState('')
    const [password, setPassword] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    })
    const [errors, setErrors] = useState({})
    
    const { user, isLoading } = useAuth()
    const { openPopup } = usePopup()
    const dispatch = useDispatch()
    const toast = useToast()

    useEffect(() => {
        if (user?.email) setEmailAddress(user.email)
    }, [user])

    const hasEmail = !!user?.email;

    const handleChangePassword = e => {
        const { id, value } = e.target
        setPassword(prev => ({ ...prev, [id]: value }))
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }))
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }

    const handleSetEmail = async () => {
        if (!validateEmail(email)) {
            setErrors({ email: "Please enter a valid developer email." })
            return
        }

        try {
            await dispatch(setEmailAction(email)).unwrap()
            toast.success('Email linked to your profile successfully')
            setErrors({})
        } catch (err) {
            toast.error(err || 'Failed to update email')
        }
    }

    const handleUpdatePassword = async () => {
        const newErrors = {}
        
        if (user?.hasPassword && !password.old_password) {
            newErrors.old_password = "Current password is required."
        }
        if (password.new_password.length < 8) {
            newErrors.new_password = "Password must be at least 8 characters."
        }
        if (password.new_password !== password.confirm_password) {
            newErrors.confirm_password = "Passwords do not match."
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            await dispatch(setPasswordAction(password)).unwrap()
            toast.success('Password set successfully')
            setErrors({})
            setPassword({
                old_password: '',
                new_password: '',
                confirm_password: ''
            })
        } catch (err) {
            toast.error(err || 'Failed to update email')
        }
    }

    return (
        <SettingsLayout>
            <div className="space-y-6">
                {/* --- Email Section --- */}
                <div className="bg-background rounded-lg border border-border overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <h2 className="text-lg font-semibold tracking-tight">Email Address</h2>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Primary Email</h3>
                            <p className="text-sm text-gray-500">
                                {hasEmail ? "Used for account recovery and notifications." : "Set your primary email to enable password login."}
                            </p>
                        </div>

                        <div className="grid gap-4 max-w-md">
                            <div className="space-y-2">
                                <label className="text-xs font-medium ml-1 text-muted-foreground">Current Email</label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    onChange={e => {
                                        setEmailAddress(e.target.value)
                                        setErrors(prev => ({...prev, email: null}))
                                    }}
                                    value={email}
                                    disabled={hasEmail} 
                                    placeholder={!hasEmail ? "dev@codify.dev" : ""}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email}</p>}
                            </div>
                            
                            {!hasEmail && (
                                <Button  
                                    className={`w-fit ${isLoading ? 'opacity-50' : 'opacity-100'}`} 
                                    onClick={handleSetEmail} 
                                    disabled ={isLoading}>
                                        {isLoading && <Loader2 className="animate-spin"/>}
                                        {isLoading ? 'Setting up...' : "Set Email Address"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Password Section --- */}
                <div className={`bg-background rounded-lg border border-border overflow-hidden transition-all ${!hasEmail ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}`}>
                    <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-primary" />
                            <h2 className="text-lg font-semibold tracking-tight">Account Security</h2>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {!hasEmail && (
                            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-600 dark:text-amber-500 text-xs">
                                <Info className="w-4 h-4 shrink-0" />
                                <span>Security settings are locked until an email is linked to your account.</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                {user?.hasPassword ? "Update Password" : "Set Account Password"}
                            </h3>
                        </div>

                        <div className="grid gap-3 max-w-md">
                            {user?.hasPassword && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium ml-1 text-muted-foreground">Current Password</label>
                                    <Input 
                                        id='old_password' 
                                        value={password.old_password}
                                        onChange={handleChangePassword}
                                        type="password" 
                                        placeholder='••••••••' 
                                        disabled={!hasEmail} 
                                    />
                                    {errors.old_password && <p className="text-[10px] text-red-500 ml-1">{errors.old_password}</p>}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-medium ml-1 text-muted-foreground">New Password</label>
                                <Input 
                                    id='new_password' 
                                    value={password.new_password}
                                    onChange={handleChangePassword}
                                    type="password" 
                                    placeholder='••••••••' 
                                    disabled={!hasEmail} 
                                />
                                {errors.new_password && <p className="text-[10px] text-red-500 ml-1">{errors.new_password}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium ml-1 text-muted-foreground">Confirm New Password</label>
                                <Input 
                                    id='confirm_password' 
                                    value={password.confirm_password}
                                    onChange={handleChangePassword}
                                    type="password" 
                                    placeholder='••••••••' 
                                    disabled={!hasEmail} 
                                />
                                {errors.confirm_password && <p className="text-[10px] text-red-500 ml-1">{errors.confirm_password}</p>}
                            </div>
                            <Button 
                                className={`w-fit ${isLoading || !hasEmail ? 'opacity-50' : 'opacity-100'}`}
                                disabled={!hasEmail || isLoading}
                                onClick={handleUpdatePassword}
                            >
                                {isLoading ? 'Updating...' : user?.hasPassword ? "Update Password" : "Set Password"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* --- Danger Zone --- */}
                <div className="rounded-lg border border-red-600/30 overflow-hidden">
                    <div className="p-4 border-b border-red-600/20 flex items-center gap-2 bg-red-600/5">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <h2 className="text-lg font-semibold text-red-600 tracking-tight">Danger Zone</h2>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-md font-bold text-foreground">Delete Account</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                All your snippets, projects, and CodifyDev profile data will be erased.
                            </p>
                        </div>
                        <Button variant="DESTRUCTIVE" className="shrink-0 flex items-center gap-2" onClick ={()=>{
                            openPopup({title : 'Delete account' , component : 'DeleteAccountPopup'})
                        }}>
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    )
}

export default AccountPage