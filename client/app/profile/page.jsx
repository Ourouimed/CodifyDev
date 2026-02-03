'use client'
import { useAuth } from "@/hooks/useAuth"
import FeedLayout from "../FeedLayout"
import Profile from "@/components/Profile"
import GithubRepos from "@/components/GithubRepos"
const ProfilePage = () => {
    const { user } = useAuth()
    return (
        <FeedLayout>
            <Profile user={user}/>
            {user?.githubId && <GithubRepos username={user?.username}/>}
        </FeedLayout>
    )
}

export default ProfilePage