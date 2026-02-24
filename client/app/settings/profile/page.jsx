'use client'

import SettingsLayout from "@/app/SettingsLayout"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { Camera, Loader2, Globe, Github, MapPin, Linkedin } from "lucide-react"; 
import { TextArea } from "@/components/ui/TextArea";
import { update } from "@/store/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";

const ProfilePage = () => {
    const toast = useToast()
    const dispatch = useDispatch()

    const { isLoading, user } = useAuth()
    const [profileForm, setProfileForm] = useState({
        name: "",
        username: "",
        bio: "",
        email: "",
        location: "", 
        avatar: null,
        banner: null,
        linkedin: "",
        github: "",
        website: "",
    });
    
    const [previews, setPreviews] = useState({
        avatar: null,
        banner: null,
    });

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user?.name || "",
                username: user?.username || "",
                bio: user?.bio || "",
                location: user?.location || "", 
                avatar: user?.avatar || null,
                banner: user?.banner || null,
                email: user?.email || "",
                linkedin: user?.linkedin || "",
                github: user?.github || "",
                website: user?.website || "",
            })

            setPreviews({
                avatar: user?.avatar || null,
                banner: user?.banner || null,
            });
        }
    }, [user])

    const validationForm = () => {
        const newErrors = {}
        if (!profileForm.name.trim()) newErrors.name = 'Name is required'
        if (!profileForm.username.trim()) newErrors.username = 'Username is required'
        if (profileForm.bio.length > 500) newErrors.bio = 'Bio too long'
        
        if (!user?.email && profileForm.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profileForm.email)) newErrors.email = 'Invalid email format';
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { id, value, type, files } = e.target;

        if (type === "file" && files[0]) {
            const file = files[0];
            setProfileForm((prev) => ({ ...prev, [id]: file }));
            setPreviews((prev) => ({
                ...prev,
                [id]: URL.createObjectURL(file),
            }));
        } else {
            setProfileForm((prev) => ({ ...prev, [id]: value }));
        }
    };

    const handleUpdateProfile = async (e) => {
        if (validationForm()) {
            const formData = new FormData();
            formData.append("name", profileForm.name);
            formData.append("username", profileForm.username);
            formData.append("bio", profileForm.bio);
            formData.append("email", profileForm.email);
            formData.append("location", profileForm.location); 
            formData.append("linkedin", profileForm.linkedin);
            formData.append("github", profileForm.github);
            formData.append("website", profileForm.website);

            if (profileForm.avatar instanceof File) formData.append("avatar", profileForm.avatar);
            if (profileForm.banner instanceof File) formData.append("banner", profileForm.banner);

            try {
                await dispatch(update(formData)).unwrap()
                toast.success('Profile updated successfully')
            }
            catch (err) {
                toast.error(err || "Failed to update profile")
            }
        }
    };

    return (
        <SettingsLayout>
            <div className="bg-background rounded-lg border border-border">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Profile Settings</h2>
                    <Button onClick={handleUpdateProfile} disabled={isLoading} className={isLoading ? 'opacity-50' : ''}>
                        {isLoading && <Loader2 className="animate-spin mr-2" />}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <div className="space-y-4 p-4">
                    {/* Banner and Avatar sections remain unchanged... */}
                    <div className="relative group">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">Cover Photo</label>
                        <div className="relative h-40 w-full rounded-xl overflow-hidden border border-dashed border-border group-hover:border-primary transition duration">
                            {previews.banner ? (
                                <img src={previews.banner} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full">No Banner Selected</div>
                            )}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <label htmlFor="banner" className="cursor-pointer bg-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">Change Banner</label>
                            </div>
                        </div>
                        <input id="banner" type="file" className="hidden" accept="image/*" onChange={handleChange} />
                    </div>

                    <div className="relative -mt-16 ml-6 flex items-end space-x-4">
                        <div className="relative group h-32 w-32">
                            <div className="h-full w-full rounded-full border-4 border-border overflow-hidden bg-gray-200 shadow-md">
                                {previews.avatar ? (
                                    <img src={previews.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-400">
                                        {profileForm.name?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>
                            <label htmlFor="avatar" className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                                <Camera size={14} />
                            </label>
                            <input id="avatar" type="file" className="hidden" accept="image/*" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="name">Full Name</label>
                                <Input id="name" value={profileForm.name} onChange={handleChange} />
                                {errors.name && <p className="text-red-500 text-[10px]">{errors.name}</p>}
                            </div>

                            <div className="space-y-2 flex-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="username">Username</label>
                                <Input id="username" value={profileForm.username} onChange={handleChange} />
                                {errors.username && <p className="text-red-500 text-[10px]">{errors.username}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="email">
                                Email Address {user?.email && <span className="lowercase font-normal opacity-70">(Verified)</span>}
                            </label>
                            <Input 
                                id="email" 
                                type="email"
                                value={profileForm.email} 
                                onChange={handleChange} 
                                disabled={!!user?.email} 
                                placeholder={!user?.email ? "Set your email address" : ""}
                            />
                            {!user?.email && <p className="text-[10px] text-amber-500 italic">Once set, email cannot be changed easily.</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="bio">Bio</label>
                            <TextArea id="bio" value={profileForm.bio} onChange={handleChange} />
                            <div className="flex items-center justify-between">
                                {errors.bio && <p className="text-red-500 text-[10px]">{errors.bio}</p>}
                                <p className={` text-xs ${profileForm.bio.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {profileForm.bio.length}/500
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Additional Info & Socials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Location Field */}
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-gray-400 shrink-0" />
                                    <Input id="location" placeholder="San Francisco, CA" value={profileForm.location} onChange={handleChange} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-gray-400 shrink-0" />
                                    <Input id="website" placeholder="Portfolio URL" value={profileForm.website} onChange={handleChange} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Linkedin size={18} className="text-gray-400 shrink-0" />
                                    <Input id="linkedin" placeholder="linkedin URL" value={profileForm.linkedin} onChange={handleChange} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Github size={18} className="text-gray-400 shrink-0" />
                                    <Input id="github" placeholder="GitHub URL" value={profileForm.github} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    )
}

export default ProfilePage