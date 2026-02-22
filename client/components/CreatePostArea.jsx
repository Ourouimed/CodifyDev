import { Button } from "@/components/ui/Button"
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/store/features/posts/postSlice";
import { Image, Link, Loader2, Plus, Send, Vote, X } from "lucide-react";
import { useEffect, useState , useRef} from "react";
import { useDispatch } from "react-redux";
import TextareaAutosize from 'react-textarea-autosize';



const CreatePostArea = () => {
    const [content, setContent] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const dispatch = useDispatch()
    const toast = useToast()
    const { isPosting } = usePosts()
        
    const fileInputRef = useRef(null)
    // 2. Generate Previews and Cleanup Memory
        useEffect(() => {
            if (selectedFiles.length === 0) {
                setPreviews([])
                return
            }
    
            // Create temporary URLs for selected files
            const objectUrls = selectedFiles.map(file => URL.createObjectURL(file))
            setPreviews(objectUrls)
    
            // Cleanup: Revoke URLs to prevent memory leaks
            return () => objectUrls.forEach(url => URL.revokeObjectURL(url))
        }, [selectedFiles])
    
        // 3. Handle File Selection
        const handleFileChange = (e) => {
            if (e.target.files) {
                const newFiles = Array.from(e.target.files)
                
                // Check if adding these files exceeds the limit of 10
                if (selectedFiles.length + newFiles.length > 10) {
                    toast.error("You can only upload up to 10 images.")
                    const remainingSlots = 10 - selectedFiles.length
                    setSelectedFiles(prev => [...prev, ...newFiles.slice(0, remainingSlots)])
                } else {
                    setSelectedFiles(prev => [...prev, ...newFiles])
                }
            }
            // Reset input value so same file can be selected again if deleted
            e.target.value = ''
        }
    
        const removeFile = (index) => {
            setSelectedFiles(prev => prev.filter((_, i) => i !== index))
        }
    
        // 4. Submit Post (FormData)
        const handlePostSubmit = async () => {
            if (!content.trim() && selectedFiles.length === 0) return
    
            const formData = new FormData()
            formData.append('content', content)
            
            // Append all files to the 'images' key for backend array processing
            selectedFiles.forEach((file) => {
                formData.append('post-images', file) 
            })
    
            try {
                await dispatch(createPost(formData)).unwrap()
                toast.success('Post created successfully')
                setContent('')
                setSelectedFiles([])
            } catch (err) {
                toast.error(err || 'Failed to create post')
            }
        }

    const isDisabled = isPosting || (content.trim().length === 0 && selectedFiles.length === 0)
    return <div className="border border-border rounded-xl p-4 shadow-sm bg-card transition-all">
                        <TextareaAutosize
                            placeholder="Share your thoughts..."
                            minRows={3} 
                            maxRows={10} 
                            className="w-full outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* Image Preview Grid */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                                {previews.map((url, index) => (
                                    <div key={url} className="relative aspect-square group">
                                        <img 
                                            src={url} 
                                            alt="upload preview" 
                                            className="w-full h-full object-cover rounded-lg border border-border shadow-sm" 
                                        />
                                        <button 
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 cursor-pointer text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* "Add More" Button inside the grid */}
                                {selectedFiles.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col cursor-pointer items-center justify-center border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary aspect-square"
                                    >
                                        <Plus size={24} />
                                        <span className="text-[10px] font-bold mt-1 uppercase">Add</span>
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end mt-2">
                            {selectedFiles.length > 0 && <span className="text-xs">{selectedFiles.length}/10 Images</span>}
                        </div>
                                            
                        {/* Footer Actions */}
                        <div className="flex items-center flex-wrap gap-4 justify-between mt-4 pt-3 border-t border-border">
                            <div className="flex items-center gap-3 flex-wrap">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <button 
                                    disabled={selectedFiles.length >= 10}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`cursor-pointer transition-colors ${selectedFiles.length >= 10 ? 'opacity-30 cursor-not-allowed' : 'hover:text-primary text-muted-foreground'}`}
                                >
                                    <Image size={20} /> 
                                </button>
                                <button type="button" className="hover:text-primary transition-colors text-muted-foreground">
                                    <Link size={20} />
                                </button>
                                <button type="button" className="hover:text-primary transition-colors text-muted-foreground">
                                    <Vote size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <span className={`text-xs font-mono ${content.length > 1000 && 'text-red-500'}`}>
                                    {content.length}/1000   
                                </span>
                                <Button 
                                    onClick={handlePostSubmit}
                                    className={`h-8 py-0 px-3 text-xs gap-1.5 ${isDisabled && 'opacity-50'}`}
                                    disabled={isDisabled}
                                    variant="PRIMARY" 
                                >
                                    {isPosting ? (
                                        <><Loader2 className="animate-spin mr-2" size={16}/>Posting...</>
                                    ) : (
                                        <><Send className="w-3.5 h-3.5 mr-2"/>Post</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
}

export default CreatePostArea 