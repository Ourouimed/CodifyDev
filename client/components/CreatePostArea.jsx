import { Button } from "@/components/ui/Button";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/store/features/posts/postSlice";
import { Code, Image, Loader2, Plus, Send, Smile, X, BarChart2} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker from "./EmpojiPicker";
import { CodeEditor } from "./CodeEditor";
import PollOptions from "./PollOptions";

const CreatePostArea = () => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [expiryDuration, setExpiryDuration] = useState('7'); 
  const dispatch = useDispatch();
  const toast = useToast();
  const { isPosting } = usePosts();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFiles.length) { 
      setPreviews([]); 
      return; 
    }
    const urls = selectedFiles.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [selectedFiles]);

  // --- Handlers ---
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
    setShowCodeEditor(prev => {
      if (!prev) setShowPoll(false); 
      if (prev) setCode('');
      return !prev;
    });
  };

  const handleTogglePoll = () => {
    setShowPoll(prev => {
      if (!prev) {
        setShowCodeEditor(false);
        setSelectedFiles([]);      
      }
      return !prev;
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, '']);
  };

  const removeOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePostSubmit = async () => {
    const hasContent = content.trim().length > 0;
    const isCodeActive = showCodeEditor && code.trim().length > 0;
    const hasFiles = selectedFiles.length > 0;
    const validPollOptions = pollOptions.filter(opt => opt.trim() !== '');
    const isPollActive = showPoll && validPollOptions.length >= 2;

    if (showPoll && !hasContent) {
      toast.error("Please provide a question for your poll.");
      return;
    }

    if (!hasContent && !isCodeActive && !hasFiles && !isPollActive) return;

    const formData = new FormData();
    formData.append('content', content);

    if (isCodeActive) {
      formData.append('code', code.trim());
      formData.append('codeLanguage', codeLanguage || 'javascript');
    }

    if (isPollActive) {
      formData.append('pollOptions', JSON.stringify(validPollOptions));
      
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDuration));
      formData.append('pollExpiresAt', expiresAt.toISOString());
    }

    selectedFiles.forEach(f => formData.append('post-images', f));

    try {
      await dispatch(createPost(formData)).unwrap();
      toast.success('Post created successfully');
      
      // Reset State
      setContent('');
      setCode('');
      setShowPicker(false);
      setShowCodeEditor(false);
      setShowPoll(false);
      setPollOptions(['', '']);
      setSelectedFiles([]);
      setExpiryDuration('7');
    } catch (err) {
      toast.error(err || 'Failed to create post');
    }
  };

  const validPollCount = pollOptions.filter(opt => opt.trim() !== '').length;
  
  const isDisabled =
    isPosting ||
    (showPoll 
      ? (!content.trim() || validPollCount < 2) 
      : !(content.trim() || selectedFiles.length > 0 || (showCodeEditor && code.trim()))
    );

  return (
    <div className="border border-border rounded-xl p-4 shadow-sm bg-card transition-all">
      <TextareaAutosize
        placeholder={showPoll ? "Ask a question..." : "Share your thoughts..."}
        minRows={3}
        maxRows={10}
        className="w-full outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {showCodeEditor && (
        <div className="relative mt-3">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={codeLanguage}
            setLanguage={setCodeLanguage}
            isEditingMode
          />
          <button
            onClick={handleToggleCode}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {showPoll && (
        <PollOptions 
          onToggle={handleTogglePoll} 
          pollOptions={pollOptions} 
          onAddOption={addOption} 
          onRemoveOption={removeOption} 
          onChange={handleOptionChange}
          expiryDuration={expiryDuration}
          onExpiryChange={setExpiryDuration}
        />
      )}

      {!showCodeEditor && !showPoll && previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
          {previews.map((url, index) => (
            <div key={url} className="relative aspect-square">
              <img src={url} alt="upload" className="w-full h-full object-cover rounded-lg border border-border shadow-sm" />
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedFiles.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary aspect-square cursor-pointer"
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      )}

      <div className="flex justify-end mt-2">
        {selectedFiles.length > 0 && !showCodeEditor && !showPoll && (
          <span className="text-[10px] font-medium text-muted-foreground">{selectedFiles.length}/10 Images</span>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-4 justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

          <button
            disabled={selectedFiles.length >= 10 || showCodeEditor || showPoll}
            onClick={() => fileInputRef.current?.click()}
            title="Upload images"
            className={`hover:bg-primary/10 size-9 flex items-center justify-center rounded-full transition-colors ${ (showCodeEditor || showPoll) ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Image size={20} className="text-primary" />
          </button>

          <button
            onClick={handleToggleCode}
            disabled={showPoll}
            title="Add code block"
            className={`size-9 flex items-center justify-center rounded-full transition-colors ${showCodeEditor ? "bg-primary/20 text-primary" : "hover:bg-primary/10 text-primary"} ${showPoll ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Code size={20} />
          </button>

          <button
            onClick={handleTogglePoll}
            disabled={showCodeEditor}
            title="Create a poll"
            className={`size-9 flex items-center justify-center rounded-full transition-colors ${showPoll ? "bg-primary/20 text-primary" : "hover:bg-primary/10 text-primary"} ${showCodeEditor ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <BarChart2 size={20} className="rotate-90" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="hover:bg-primary/10 size-9 flex items-center justify-center rounded-full cursor-pointer transition-colors"
            >
              <Smile size={20} className="text-primary" />
            </button>
            {showPicker && <div className="absolute bottom-full left-0 z-50 mb-2"><EmojiPicker onSelect={(e) => setContent(prev => prev + e.emoji)} /></div>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-[11px] font-mono ${(content.length > 1000) ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
            {content.length}/1000
          </span>
          <Button
            onClick={handlePostSubmit}
            className={`h-9 px-4 text-xs font-bold gap-2 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"}`}
            disabled={isDisabled}
            variant="PRIMARY"
          >
            {isPosting ? (
              <><Loader2 className="animate-spin" size={16} /> Posting</>
            ) : (
              <><Send size={14} /> Post</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostArea;