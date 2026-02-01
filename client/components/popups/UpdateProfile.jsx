'use client'
import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { usePopup } from "@/hooks/usePopup";
import { useToast } from "@/hooks/useToast";
import { useDispatch } from "react-redux";
import { Camera, Loader2 } from "lucide-react";
import { TextArea } from "../ui/TextArea";
import { update } from "@/store/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";

export default function UpdateProfile({ profile }) {
  const { closePopup } = usePopup()
  const toast = useToast()
  const dispatch = useDispatch()

  const { isLoading } = useAuth()

  
  const [profileForm, setProfileForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    avatar: profile.avatar || null,
    banner: profile.banner || null,
  });

  // State for temporary browser URLs to show previews
  const [previews, setPreviews] = useState({
    avatar: profile.avatar || null,
    banner: profile.banner || null,
  });

  const [errors , setErrors ] = useState({})

  const validationForm = ()=>{
    const newErrors = {}
    if(!profileForm.name.trim()) newErrors.name = 'Name is required'
    if(!profileForm.username.trim()) newErrors.username = 'Username is required'
    if(profileForm.bio.length > 500) newErrors.bio = 'Bio too long' 

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      const file = files[0];
      setProfileForm((prev) => ({ ...prev, [id]: file }));
      
      // Create a temporary local URL for the preview
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
        
        // Append files only if they were selected
        if (profileForm.avatar) formData.append("avatar", profileForm.avatar);
        if (profileForm.banner) formData.append("banner", profileForm.banner);


        try {
            await dispatch(update(formData)).unwrap()
            toast.success('Profile updated successfully')
            closePopup()
        }
        catch (err){    
                toast.error(err)
        }   
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Banner Section */}
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

      {/* Avatar Section */}
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
            <Camera size={14}/>
          </label>
          <input id="avatar" type="file" className="hidden" accept="image/*" onChange={handleChange} />
        </div>
      </div>

      {/* Inputs Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="name">Full Name</label>
          <Input id="name" value={profileForm.name} onChange={handleChange} />
          {errors.name && <p className="text-red-500 text-[10px]">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="username">Username</label>
          <Input id="username" value={profileForm.username} onChange={handleChange} />
            {errors.username && <p className="text-red-500 text-[10px]">{errors.username}</p>}
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
      </div>

      <div className="flex justify-end items-center gap-2">
            <Button variant="outline" onClick={()=> closePopup()}>
                Cancel
            </Button>

            <Button onClick={handleUpdateProfile} disabled={isLoading} className={isLoading && 'opacity-50'}>
                {isLoading && <Loader2 className="animate-spin mr-2" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>


      </div>
    </div>
  );
}