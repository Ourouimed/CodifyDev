'use client'
import { useAuth } from "@/hooks/useAuth"
import FeedLayout from "../FeedLayout"
import Profile from "@/components/Profile"
const ProfilePage = () => {
    const { user } = useAuth()
    return (
        <FeedLayout>
            <Profile user={user}/>
        </FeedLayout>
    )
}

export default ProfilePage