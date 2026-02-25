'use client'
import { useEffect } from "react"
import SettingsLayout from "../SettingsLayout"
import { useRouter } from "next/navigation"

const SettingsPage = () => {
    const router = useRouter()
    useEffect(()=>{
        router.push('/settings/profile')
    },[])
    return <SettingsLayout>
        
    </SettingsLayout>
}

export default SettingsPage