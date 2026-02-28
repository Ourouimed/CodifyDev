import { Bell } from "lucide-react"
import NotificationItem from "./ui/NotificationItem"

const NotificationDropdown = ({notifications , markAsRead})=>{
    console.log(notifications)
    return <div className="min-w-80 max-h-80 overflow-y-auto absolute right-0 mt-3  bg-background border border-border rounded-xl shadow-xl animate-in fade-in zoom-in duration-200 divide-y divide-border">
        {notifications.length === 0 ? <>
            <div className="flex items-center justify-center flex-col gap-2 p-4">
                <Bell size={32}/>
                <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
        </> : <>
            <h4 className="text-lg font-semibold px-4 py-2">Notifications</h4>
            {notifications.map(notif => <NotificationItem key={notif._id} notification={notif} onMarkAsRead={markAsRead}/>)}
        </>}
    </div>
}

export default NotificationDropdown