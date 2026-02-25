'use client'

import { useAuth } from "@/hooks/useAuth"
import { settingsMenu } from "@/lib/links"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SettingsSidebar = () => {
    const { user } = useAuth()
    const path = usePathname();

    return (
        <>
            {/* Mobile Navigation: Horizontal Scroll Bar */}
            <nav className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-border bg-background sticky top-[64px] z-10 px-4">
                {settingsMenu.map(({ url, name, icon: Icon }, i) => {
                    const isActive = path === url;
                    return (
                        <Link 
                            key={i} 
                            href={url} 
                            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                                isActive 
                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                            }`}
                        >
                            <Icon size={14} />
                            {name}
                        </Link>
                    )
                })}
            </nav>

            {/* Desktop Sidebar */}
            <aside className="md:sticky hidden md:block top-24 h-fit bg-background rounded-2xl border border-border divide-y divide-border overflow-hidden">
                {/* User Header */}
                <div className="p-3">
                    <Link 
                        href={`/profile/${user?.username}`} 
                        className='flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-xl transition-all group'
                    >
                        <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-border flex-shrink-0">
                            {user?.avatar ? (
                                <Image 
                                    src={user.avatar}
                                    alt={user.name || "avatar"}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            ) : (  
                                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm"> 
                                    {user?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">@{user?.username}</p>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <nav className="p-2 space-y-1">
                    {settingsMenu.map(({ url, name, icon: Icon }, i) => {
                        const isActive = path === url;
                        return (
                            <Link 
                                key={i} 
                                href={url} 
                                className={`
                                    text-[13px] font-medium relative transition-all duration-200 flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    ${isActive 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }
                                `}
                            >
                                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                {name}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-4 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}

export default SettingsSidebar