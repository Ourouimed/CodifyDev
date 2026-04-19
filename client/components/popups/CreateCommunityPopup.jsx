import { useState, useRef } from "react"
import { Input } from "../ui/Input"
import { TextArea } from "../ui/TextArea"
import SwitchBtn from "../ui/SwitchBtn"
import { Button } from "../ui/Button"
import { usePopup } from "@/hooks/usePopup"
import { ImagePlus, Loader2, Plus, X } from "lucide-react" 
import { createCommunity } from "@/store/features/communities/communitySlice"
import { useToast } from "@/hooks/useToast"
import { useDispatch } from "react-redux"
import { useCommunity } from "@/hooks/useCommunity"
import Select from "../ui/Select"

const CreateCommunityPopup = () => {
    const { closePopup } = usePopup()
    const fileInputRef = useRef(null)
    const { isLoading } = useCommunity()
    
    const [communityForm, setCommunityForm] = useState({
        name: '',
        description: '',
        image: null,
        visibility: 'public',
        required_post_approval: false,
        required_join_approval: false
    })

    const [validationErrors, setValidationErrors] = useState({})

    const validateForm = ()=>{
        const errors = {}
        if(!communityForm.name.trim()) errors.name = "Community name is required"
        if(!communityForm.image) errors.image = "Community image is required"
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Create a local URL for the image preview
    const [previewUrl, setPreviewUrl] = useState(null)
    const toast = useToast()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { id, value } = e.target
        setCommunityForm(prev => ({ ...prev, [id]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setCommunityForm(prev => ({ ...prev, image: file }))
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setCommunityForm(prev => ({ ...prev, image: null }))
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleCreateCommunity = async () => {
        if (!validateForm()) return
        // Prepare FormData
        const formData = new FormData()
        
        formData.append('name', communityForm.name)
        formData.append('description', communityForm.description)
        formData.append('visibility', communityForm.visibility)
        formData.append('required_post_approval', communityForm.required_post_approval)
        formData.append('required_join_approval', communityForm.required_join_approval)
        
        if (communityForm.image) {
            formData.append('community_image', communityForm.image)
        }

       try {
             // Dispatch your action here
            await dispatch(createCommunity(formData)).unwrap()
            toast.success("Community created successfully!");
            closePopup();
        } catch (err) {
             console.log(err)
             toast.error(err || "Failed to create community. Please try again.");
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-2xl">Create New Community</h3>
                <p className="text-sm text-gray-400">Fill in the details to launch your community.</p>
            </div>

            <div className="space-y-4">
                {/* Image Upload Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Community Avatar <span className="text-red-500">*</span></label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative h-32 w-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
                    >
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                                >
                                    <X size={12} />
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <ImagePlus size={24} />
                                <span className="text-[10px] mt-1">Upload</span>
                            </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />

                    {validationErrors.image && <span className="text-xs text-red-500">{validationErrors.image}</span>}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-sm font-medium">Community Name  <span className="text-red-500">*</span> </label>
                    <Input 
                        id='name' 
                        placeholder='e.g. Cmc dev205' 
                        onChange={handleChange} 
                        value={communityForm.name} 
                    />
                    {validationErrors.name && <span className="text-xs text-red-500">{validationErrors.name}</span>}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-sm font-medium">Community Description</label>
                    <TextArea 
                        id='description' 
                        placeholder='Describe your community' 
                        onChange={handleChange} 
                        value={communityForm.description} 
                    />
                </div>
            </div>

            {/* Community Options Card */}
            <div className="flex flex-col gap-1">
                <h4 className="font-bold">Community options</h4>
                <div className="border border-border rounded-lg divide-y divide-border">
                    <div className="flex items-center justify-between gap-1 p-4">
                        <label htmlFor='required_join_approval' className="text-sm font-medium">Admin join approval</label>
                        <SwitchBtn
                            isOn={communityForm.required_join_approval} 
                            onToggle={() => setCommunityForm(prev => ({ ...prev, required_join_approval: !prev.required_join_approval }))}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-1 p-4">
                        <label htmlFor='required_post_approval' className="text-sm font-medium">Admin post approval</label>
                        <SwitchBtn
                            isOn={communityForm.required_post_approval} 
                            onToggle={() => setCommunityForm(prev => ({ ...prev, required_post_approval: !prev.required_post_approval }))}
                        />
                    </div>


                    <div className="flex items-center justify-between gap-1 p-4">
                        <label htmlFor='visibility' className="text-sm font-medium flex-1">Visibility</label>
                        <Select options={[{label : 'public' , value : 'public'}, {label : 'private' , value : 'private'}]} className='w-auto ' value={communityForm.visibility} onChange={(value) => setCommunityForm(prev => ({ ...prev, visibility: value.value }))}/>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closePopup}>Cancel</Button>
                 <Button disabled={isLoading} className={isLoading ? 'opacity-30' : ''} onClick={handleCreateCommunity}>
                    {isLoading ? 'Creating...' : 'Create Community'} {isLoading ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>}
                </Button>
            </div>
        </div>
    )
}

export default CreateCommunityPopup