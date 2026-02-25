
import Image from "next/image"
import { Button } from "./ui/Button"
import { Bell, Code2, Search, LogOut, User, Settings } from "lucide-react"
import { Input } from "./ui/Input"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import axiosService from "@/lib/axiosService"
import NotificationDropdown from "./NotificationDropdown"
import { getNotifications } from "@/services/getNotifications"

const Header = ({ user, onLogout }) => {
    const [profileIsOpen, setProfileIsOpen] = useState(false)
    const [notifIsOpen, setNotifIsOpen] = useState(false)

    const [notifications, setNotifications] = useState([])
    useEffect(()=>{
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications()
                setNotifications(data.notifications)
            }
            catch(err) {
                console.error(err)
            }
        }
        fetchNotifications()
    },[])
    
    const profileRef = useRef(null)
    const notificationRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileIsOpen(false)
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotifIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleMarkAsRead = async (notifId) => {
        try {
            await axiosService.post(`/api/notifications/read-notification/${notifId}`)
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notifId ? { ...notif, isRead: true } : notif
                )
            );
        } catch (err) {
            console.error(err);
        }
    }
    
    const unreadCount = notifications.filter(notif => !notif.isRead).length
    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-3 md:px-10 py-3 flex items-center justify-between">
            
            
            <div className="flex items-center gap-6">
                <Link href="/feed" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Code2 className="text-primary-foreground" size={14}/>
                    </div>
                    <h3 className="text-xl font-bold text-xs sm:text-base">
                        Codify<span className="text-primary">Dev</span> 
                    </h3>
                </Link>


                <div className="hidden md:block w-72">
                    <Input placeholder='Search projects, devs...' icon={Search}/>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative" ref={notificationRef}>
                    <Button variant="outline" className="!p-2 sm:flex relative" onClick={() => setNotifIsOpen(!notifIsOpen)}>
                        <Bell size={14}/>
                        {unreadCount > 0 && (
                            <div className="size-4 rounded-full p-1 bg-red-500 absolute -top-1 -right-1 border border-background text-[10px] text-white flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                        )}
                    </Button>
                    {notifIsOpen && (
                        <NotificationDropdown notifications={notifications} markAsRead={handleMarkAsRead}/>
                    )}
                </div>
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setProfileIsOpen(!profileIsOpen)}
                        className="size-8 rounded-full cursor-pointer relative overflow-hidden flex justify-center items-center border border-border p-2"
                    >
                        {user?.avatar ? (
                            <Image 
                                src={user.avatar} 
                                fill 
                                alt="Profile" 
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-sm font-bold">
                                {user?.displayName?.[0] || user?.username?.[0]}
                            </span>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {profileIsOpen && (
                        <div className="min-w-56 absolute right-0 mt-3  bg-background border border-border rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200 divide-y divide-border">
                            <div className="px-4 py-2 flex items-center gap-2">
                                <div className="size-10 rounded-full relative overflow-hidden flex justify-center items-center border border-border p-2">
                                    {user?.avatar ? (
                                        <Image 
                                            src={user.avatar} 
                                            fill 
                                            alt="Profile" 
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {user?.name[0]}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
                                </div>
                            </div>
                            
                           <div>
                                <Link href={`/profile/${user?.username}`} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                                    <User size={16} /> Profile
                                </Link>
                                <Link href={'/settings'} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                                    <Settings size={16} /> Settings
                                </Link>
                           </div>
                            
                            <div className="mt-1 pt-1">
                                <button 
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition duration-300"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header