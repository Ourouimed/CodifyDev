import { usePopup } from "@/hooks/usePopup"
import { Button } from "./ui/Button"

const Profile = ({user})=>{
    const { openPopup } = usePopup()
    const handleOpenUpdateProfilePopup = ()=>{
            openPopup({title : 'Test' , component : 'UpdateProfile' , props : {profile : user}})
    }
    return <div className="bg-background rounded-lg border border-border overflow-hidden">
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
                            <Button variant="outline" onClick={handleOpenUpdateProfilePopup}>Edit Profile</Button>
                            <Button size="sm">Share</Button>
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