import { formatSmartDate } from "@/lib/date"
import { Calendar, MapPin, Video, ArrowUpRight, Users, Infinity } from "lucide-react"
import Link from "next/link"

export const EventCard = ({ event: e }) => {
  return (
    <Link 
      href={`/events/${e._id}`} 
      className="group block space-y-4 border border-border p-5 rounded-2xl bg-card hover:border-primary/50 hover:shadow-sm transition duration-300"
    >
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Calendar size={14} className="text-primary" />
          <span>
            {formatSmartDate(e.start)} — {formatSmartDate(e.end)}
          </span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition duration-300 bg-foreground rounded-full size-8 flex items-center justify-center ">
            <ArrowUpRight className="text-background" />
        </div>
        
      </div>

      {/* Title */}
      <h4 className="text-xl font-semibold tracking-tight leading-tight group-hover:text-primary transition-colors">
        {e.name}
      </h4>

      {/* Author Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <img 
          className="size-7 rounded-full object-cover border border-border" 
          src={e.author.avatar} 
          alt={e.author.displayName}
        />
        <span>
          by <span className="font-semibold text-foreground">{e.author.displayName}</span>
        </span>
      </div>

      {/* Conditional Details */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div>
            {e.event_type === 'location' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} />
                <span className="truncate">{e.location}</span>
            </div>
            )}

            {e.event_type === 'virtual' && (
            <div className="flex items-center gap-2 text-sm text-primary">
                <Video size={14} />
                <span className="truncate">{e.meeting_link}</span>
            </div>
            )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-primary">
                <Users size={14} /> 
                <span className="truncate flex items-center gap-2">{e.attendees.length} / {e.unlimited_capacity ? <Infinity size={14}/> :e.capacity}</span>
        </div>
      </div>
    </Link>
  )
}