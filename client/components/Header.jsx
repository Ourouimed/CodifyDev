
import Image from "next/image"
import { Button } from "./ui/Button"
import { Bell, Code2, Search, LogOut, User, Settings } from "lucide-react"
import { Input } from "./ui/Input"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

const Header = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 md:px-20 py-3 flex items-center justify-between">
            
            
            <div className="flex items-center gap-6">
                <Link href="/feed" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Code2 className="text-primary-foreground" size={20}/>
                    </div>
                    <h3 className="text-xl font-bold hidden sm:block">
                        Codify<span className="text-primary">Dev</span> 
                    </h3>
                </Link>


                <div className="hidden md:block w-72">
                    <Input placeholder='Search projects, devs...' icon={Search}/>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" className="!p-2 sm:flex">
                    <Bell size={18}/>
                </Button>

                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="size-10 rounded-full cursor-pointer relative overflow-hidden flex justify-center items-center border border-border p-2"
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
                    {isOpen && (
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
                                <Link href='/profile' className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors">
                                    <User size={16} /> Profile
                                </Link>
                                <Link href={'/ddd'} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors">
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