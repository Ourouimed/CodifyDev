import { Plus, Trash2, X, Clock } from "lucide-react"
import { Input } from "./ui/Input"

const PollOptions = ({ 
  pollOptions, 
  onToggle, 
  onAddOption, 
  onRemoveOption, 
  onChange,
  expiryDuration, 
  onExpiryChange  
}) => {
  return (
    <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20 relative">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Poll Options
        </span>
        <button onClick={onToggle} className="cursor-pointer text-muted-foreground hover:text-destructive">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {pollOptions.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => onChange(index, e.target.value)}
              
              maxLength={50}
            />
            {pollOptions.length > 2 && (
              <button
                onClick={() => onRemoveOption(index)}
                className="p-1.5 cursor-pointer text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          {pollOptions.length < 4 ? (
            <button
              onClick={onAddOption}
              className="text-xs flex items-center gap-1.5 text-primary font-semibold hover:opacity-80 ml-1 cursor-pointer"
            >
              <Plus size={14} /> Add option
            </button>
          ) : <div />}

        
          <div className="flex items-center gap-2">
            <Clock size={14}/>
            <select
              value={expiryDuration}
              onChange={(e) => onExpiryChange(e.target.value)}
              className="bg-background  text-[11px] font-medium text-foreground outline-none cursor-pointer hover:text-foreground transition-colors"
            >
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollOptions