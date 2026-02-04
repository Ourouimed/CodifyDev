'use client'
import { useAuth } from "@/hooks/useAuth"
import FeedLayout from "../FeedLayout"
import Profile from "@/components/Profile"
import GithubRepos from "@/components/GithubRepos"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { GithubAuthBtn } from "@/components/ui/GithubAuthBtn"
const ProfilePage = () => {
    const { user } = useAuth()
    return (
        <FeedLayout>
            <Profile user={user}/>
{user?.githubUsername ? (
  <GithubRepos username={user.githubUsername} />
) : (
  <div className="p-8 mt-4 flex flex-col gap-4 rounded-xl border border-border bg-background items-center justify-center text-center">
    <div className="bg-foreground text-background p-3 rounded-full shadow-sm">
      <Github className="w-8 h-8" /> 
    </div>
    <div className="space-y-1">
      <h4 className="font-semibold text-lg">Link GitHub Account</h4>
      <p className="text-sm text-muted-foreground max-w-[250px]">
        Connect your account to showcase your repositories directly on your profile.
      </p>
    </div>
    <GithubAuthBtn/>
  </div>
)}
        </FeedLayout>
    )
}

export default ProfilePage