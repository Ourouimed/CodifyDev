import { Button } from "./ui/Button"
import { useToast } from "@/hooks/useToast"
import { Edit, Github, Globe, Linkedin, MapPin, Share, UserCheck, UserPlus } from "lucide-react"
import { followUnfollow } from "@/services/followUnfollow"
import Image from "next/image"
import Link from "next/link"

const Profile = ({ user, isMyProfile, setProfile }) => {
    const toast = useToast()

    const handleFollowUnfollow = async () => {
        try {
            const response = await followUnfollow(user.username)
            setProfile(response.profile)
            toast.success(user.isFollowing ? "Unfollowed successfully" : "Following user")
        } catch (error) {
            toast.error(error?.message || "Failed to update follow status")
        }
    }

    const handleShare = () => {
        const profileURL = `${window.location.origin}/profile/${user?.username}`;
        navigator.clipboard.writeText(profileURL)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };

    // Helper to ensure external links work correctly
    const formatUrl = (url) => url?.startsWith('http') ? url : `https://${url}`;

    const hasSocials = !!(user?.location || user?.website || user?.linkedin || user?.github);

    return (
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
            {/* Cover Photo */}
            <div className="w-full bg-muted h-48 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                {user?.banner && (
                    <img src={user.banner} alt="Profile Banner" className="w-full h-full object-cover" />
                )}
            </div>

            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-20 mb-4 gap-4">
                    {/* Avatar Wrapper */}
                    <div className="relative">
                        <div className="w-32 h-32 relative overflow-hidden rounded-full border-4 border-background bg-secondary flex-shrink-0">
                            {user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={`${user.username}'s avatar`}
                                    fill
                                    priority // High priority for LCP
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold uppercase">
                                    {user?.name?.charAt(0) || user?.username?.charAt(0) || "?"}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pb-1">
                        {isMyProfile ? (
                            <Button variant="outline" href="/settings/profile" className="flex gap-2">
                                <Edit className="w-4 h-4" />
                                <span className="text-sm">Edit Profile</span>
                            </Button>
                        ) : (
                            <Button 
                                variant={user.isFollowing ? "outline" : "default"} 
                                onClick={handleFollowUnfollow}
                                className="flex gap-2"
                            >
                                <span className="text-sm">{user.isFollowing ? 'Following' : 'Follow'}</span>
                                {user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            </Button>
                        )}
                        <Button variant="secondary" onClick={handleShare} className="flex gap-2">
                            <span className="hidden xs:inline text-sm">Share</span>
                            <Share className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {user?.name || "Anonymous User"}
                    </h1>
                    <p className="text-muted-foreground">@{user?.username}</p>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-6">
                    <div className="text-sm">
                        <span className="font-bold text-foreground">{user?.followers?.length || 0}</span>
                        <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-bold text-foreground">{user?.following?.length || 0}</span>
                        <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                </div>

                {/* Socials / Location */}
                {hasSocials && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border pt-4">
                        {user?.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={16} /> {user.location}
                            </div>
                        )}
                        {user?.website && (
                            <Link href={formatUrl(user.website)} target="_blank" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                <Globe size={16} /> {user.website.replace(/^https?:\/\//, '')}
                            </Link>
                        )}
                        {user?.github && (
                            <Link href={formatUrl(user.github)} target="_blank" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                <Github size={16} /> GitHub
                            </Link>
                        )}
                        {user?.linkedin && (
                            <Link href={formatUrl(user.linkedin)} target="_blank" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                <Linkedin size={16} /> LinkedIn
                            </Link>
                        )}
                    </div>
                )}

                {/* Bio */}
                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm leading-relaxed text-foreground/80 italic">
                        {user?.bio || "No bio yet. Tell the world about yourself!"}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile