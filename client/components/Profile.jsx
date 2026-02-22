import { usePopup } from "@/hooks/usePopup"
import { Button } from "./ui/Button"
import { useToast } from "@/hooks/useToast"
import { Edit, Share, UserCheck, UserPlus } from "lucide-react"
import { useDispatch } from "react-redux"
import { followUnfollow } from "@/services/followUnfollow"

const Profile = ({user , isMyProfile , setProfile})=>{
    const { openPopup } = usePopup()
    const toast = useToast()
    const handleOpenUpdateProfilePopup = ()=>{
            openPopup({title : 'Test' , component : 'UpdateProfile' , props : {profile : user}})
    }


    const handleFollowUnfollow = async ()=>{
        try {
            const response = await followUnfollow(user.username)
            setProfile(response.profile)
            toast.success("Follow status updated")
        } catch (error) {
            toast.error(error || "Failed to update follow status")
        }
    }

    const handleShare = () => {
        const profileURL = `${window.location.origin}/profile/${user?.username}`;
        navigator.clipboard.writeText(profileURL)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };
    return <div className="bg-background rounded-2xl border border-border overflow-hidden">
                {/* Cover Photo */}
                <div className="w-full bg-primary h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                    {user?.banner && <img src={user?.banner} alt={"Banner"}  className="w-full h-full object-cover"/>}
                </div>

                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-20 mb-4 gap-4">
                        {/* Avatar Wrapper */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-background bg-muted overflow-hidden">
                                {user?.avatar ? (
                                    <img 
                                        src={user?.avatar} 
                                        alt={user.name || "Profile"} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground text-3xl font-bold">
                                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pb-2">
                            {isMyProfile ? 
                                <Button variant="outline" onClick={handleOpenUpdateProfilePopup}>
                                    <Edit className="w-3.5 h-3.5"/> Edit Profile
                                </Button> : 
                                <Button variant="outline" onClick={handleFollowUnfollow}>
                                    {user.isFollowing ? 'Unfollow' : 'Follow'} 
                                    {user.isFollowing ? 
                                        <UserCheck className="w-3.5 h-3.5"/> : 
                                        <UserPlus className="w-3.5 h-3.5"/>
                                    }
                                </Button>}
                            <Button onClick={handleShare}>Share <Share className="w-3.5 h-3.5"/></Button>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            {user?.name || "Anonymous User"}
                        </h1>
                        <p className="text-muted-foreground">
                            @{user?.username}
                        </p>
                    </div>

                    {/* Followers / Following Stats */}
                    <div className="mt-4 flex items-center gap-3">
                        <div>
                            <span className="font-semibold">{user?.followers?.length || 0}</span> Followers
                        </div>
                        <div>
                            <span className="font-semibold">{user?.following?.length || 0}</span> Following
                        </div>
                    </div>

                    {/* Bio or Stats Placeholder */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-foreground/80">
                            {user?.bio || "No bio yet. Tell the world about yourself!"}
                        </p>
                    </div>

                </div>
            </div>
}

export default Profile