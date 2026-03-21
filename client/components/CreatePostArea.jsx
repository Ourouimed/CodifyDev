import { Button } from "@/components/ui/Button"
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/store/features/posts/postSlice";
import { Check, Copy, Code, Image, Loader2, Plus, Send, Smile, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker from "./EmpojiPicker";
import { CodeEditor } from "./CodeEditor";


const CreatePostArea = () => {
  const [content,       setContent]       = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews,      setPreviews]      = useState([]);
  const [showPicker,    setShowPicker]    = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code,          setCode]          = useState('');
  const [codeLanguage,  setCodeLanguage]  = useState('javascript');

  const dispatch     = useDispatch();
  const toast        = useToast();
  const { isPosting } = usePosts();
  const fileInputRef  = useRef(null);

  // Previews
  useEffect(() => {
    if (!selectedFiles.length) { setPreviews([]); return; }
    const urls = selectedFiles.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [selectedFiles]);

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    if (selectedFiles.length + newFiles.length > 10) {
      toast.error("You can only upload up to 10 images.");
      const slots = 10 - selectedFiles.length;
      setSelectedFiles(prev => [...prev, ...newFiles.slice(0, slots)]);
    } else {
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (i) => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleToggleCode = () => {
    setShowCodeEditor(prev => { if (prev) setCode(''); return !prev; });
  };

  const handlePostSubmit = async () => {
    const hasContent = content.trim().length > 0;
    // Check if editor is open AND has actual text
    const isCodeActive = showCodeEditor && code.trim().length > 0;

    console.log(isCodeActive)
    const hasFiles = selectedFiles.length > 0;

    // Global check: if nothing is being shared, exit
    if (!hasContent && !isCodeActive && !hasFiles) return;

    const formData = new FormData();
    formData.append('content', content);

    // Only append code fields if there's actually code
    if (isCodeActive) {
        formData.append('code', code.trim());
        formData.append('codeLanguage', codeLanguage || 'javascript'); 
    }

    selectedFiles.forEach(f => formData.append('post-images', f));

    try {
        await dispatch(createPost(formData)).unwrap();
        toast.success('Post created successfully');
        
        // Reset all states
        setContent(''); 
        setCode(''); 
        setShowPicker(false);
        setShowCodeEditor(false); 
        setSelectedFiles([]);
    } catch (err) {
        toast.error(err || 'Failed to create post');
    }
    };

  const isDisabled =
    isPosting ||
    (content.trim().length === 0 &&
     selectedFiles.length === 0 &&
     !(showCodeEditor && code.trim().length > 0));

  return (
    <div className="border border-border rounded-xl p-4 shadow-sm bg-card transition-all">

      <TextareaAutosize
        placeholder="Share your thoughts..."
        minRows={3}
        maxRows={10}
        className="w-full outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Code Editor */}
      {showCodeEditor && (
        <div className="relative">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={codeLanguage}
            setLanguage={setCodeLanguage}
            isEditingMode
          />
          <button
            onClick={handleToggleCode}
            className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
            title="Remove code block"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Image Preview Grid */}
      {!showCodeEditor && previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
          {previews.map((url, index) => (
            <div key={url} className="relative aspect-square">
              <img src={url} alt="upload preview" className="w-full h-full object-cover rounded-lg border border-border shadow-sm" />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 cursor-pointer text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          ))}
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
        {selectedFiles.length > 0 && !showCodeEditor && (
          <span className="text-xs">{selectedFiles.length}/10 Images</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center flex-wrap gap-4 justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

          <button
            disabled={selectedFiles.length >= 10 || showCodeEditor}
            onClick={() => fileInputRef.current?.click()}
            title={showCodeEditor ? "Disable code block to upload images" : "Upload images"}
            className={`hover:bg-primary/20 size-8 flex items-center justify-center rounded-full cursor-pointer transition duration-300 ${showCodeEditor ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <Image size={20} />
          </button>

          <button
            onClick={handleToggleCode}
            title={showCodeEditor ? "Remove code block" : "Add code block"}
            className={`size-8 flex items-center justify-center rounded-full cursor-pointer transition duration-300 ${showCodeEditor ? "bg-primary/20 text-primary" : "hover:bg-primary/20"}`}
          >
            <Code size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="hover:bg-primary/20 size-8 flex items-center justify-center rounded-full cursor-pointer transition duration-300"
            >
              <Smile size={20} />
            </button>
            {showPicker && <EmojiPicker onSelect={(e) => setContent(prev => prev + e.emoji)} />}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className={`text-xs font-mono ${content.length > 1000 && "text-red-500"}`}>
            {content.length}/1000
          </span>
          <Button
            onClick={handlePostSubmit}
            className={`h-8 py-0 px-3 text-xs gap-1.5 ${isDisabled && "opacity-50"}`}
            disabled={isDisabled}
            variant="PRIMARY"
          >
            {isPosting
              ? <><Loader2 className="animate-spin mr-2" size={16} />Posting...</>
              : <><Send className="w-3.5 h-3.5 mr-2" />Post</>
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostArea;