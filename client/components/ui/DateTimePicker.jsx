import { Calendar, Clock } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const DateTimePicker = ({ date = new Date() , onDateTimeChange}) => {
    const formatInitialValue = (inputDate) => {
        const d = new Date(inputDate);
        return {
            date: d.toLocaleDateString('en-CA'),
            time: d.toTimeString().slice(0, 5)
        };
    };

    

    const [dateTime, setDateTime] = useState(() => formatInitialValue(date));
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    useEffect(() => {
    // Only call if the function exists
    if (onDateTimeChange) {
        onDateTimeChange(dateTime);
    }
}, [dateTime, onDateTimeChange]);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "Select Date";
        const [year, month, day] = dateString.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const currentYear = new Date().getFullYear();

        const options = { day: 'numeric', month: 'short' };
        if (year !== currentYear) options.year = 'numeric';

        return dateObj.toLocaleDateString('en-GB', options);
    };

    return (
        <div className="inline-flex border border-border rounded-lg bg-border/40 divide-x-1 divide-border overflow-hidden">
            {/* Date Section */}
            <div 
                onClick={() => dateInputRef.current?.showPicker()}
                className="py-2 px-4 text-xs flex items-center gap-2 cursor-pointer hover:bg-border/30 transition-colors"
            >
                <Calendar size={14} className="text-muted-foreground" />
                <span className="font-medium whitespace-nowrap">
                    {formatDisplayDate(dateTime.date)}
                </span>
                <input 
                    type="date" 
                    ref={dateInputRef}
                    value={dateTime.date}
                    onChange={(e) => setDateTime(prev => ({ ...prev, date: e.target.value }))}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                />
            </div>

            {/* Time Section */}
            <div 
                onClick={() => timeInputRef.current?.showPicker()}
                className="py-2 px-4 text-xs flex items-center gap-2 cursor-pointer hover:bg-border/30 transition-colors"
            >
                <Clock size={14} className="text-muted-foreground" />
                <span className="font-medium">{dateTime.time}</span>
                <input 
                    type="time" 
                    ref={timeInputRef}
                    value={dateTime.time}
                    onChange={(e) => setDateTime(prev => ({ ...prev, time: e.target.value }))}
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                />
            </div>
        </div>
    )
}

export default DateTimePicker