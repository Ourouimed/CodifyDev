'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import FeedLayout from "../../FeedLayout"
import Profile from "@/components/Profile"
import GithubRepos from "@/components/GithubRepos"
import { Github, AlertCircle, Loader2 } from "lucide-react"
import { GithubAuthBtn } from "@/components/ui/GithubAuthBtn"
import { useToast } from "@/hooks/useToast"
import { getProfile } from "@/services/getProfile"

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const { userId } = useParams()
    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return
            try {
                setLoading(true)
                const data = await getProfile(userId) 
                setProfile(data)
            } catch (err) {
                console.error(err)
                toast.error(err.message || 'Error fetching profile')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <FeedLayout>
                <div className="flex flex-col items-center justify-center pt-20 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground font-medium animate-pulse">
                        Fetching developer details...
                    </p>
                </div>
            </FeedLayout>
        )
    }

    if (!profile?.profile) {
        return (
            <FeedLayout>
                <div className="flex flex-col items-center justify-center pt-20 text-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-destructive/50" />
                    <h2 className="text-xl font-semibold">Profile Not Found</h2>
                    <p className="text-muted-foreground max-w-xs">
                        We couldn't find a profile for "{userId}". Check the spelling or try again later.
                    </p>
                </div>
            </FeedLayout>
        )
    }

    return (
        <FeedLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Profile user={profile?.profile} />

                <div className="mt-4">
                    {profile.profile?.githubUsername ? (
                            
                            <GithubRepos username={profile.profile.githubUsername} />
                    ) : (
                        <div className="p-10 mt-4 flex flex-col gap-5 rounded-2xl border border-border items-center justify-center text-center transition-colors">
                            <div className="bg-foreground text-background p-4 rounded-full shadow-md">
                                <Github className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-xl">Link your GitHub</h4>
                                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                                    Showcase your coding skills by displaying your public repositories directly on your profile.
                                </p>
                            </div>
                            <GithubAuthBtn />
                        </div>
                    )}
                </div>
            </div>
        </FeedLayout>
    )
}

export default ProfilePage