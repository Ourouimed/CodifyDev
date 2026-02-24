import { useAuth } from "@/hooks/useAuth"
import { settingsMenu } from "@/lib/links"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SettingsSidebar = ()=>{
    const { user } = useAuth()
    const path = usePathname();
    return <aside className="md:sticky hidden md:block top-20 h-fit bg-background rounded-2xl border border-border divide-y divide-border">
        <div className="p-2">
            <Link href={`/profile/${user?.username}`} className='flex items-center gap-3 p-2 hover:bg-primary/10 rounded-lg transition'>
                <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-border flex-shrink-0">
                    {user?.avatar ? (
                        <Image 
                            src={user.avatar}
                            alt={user.name || "avatar"}
                            fill
                            className="object-cover"
                        />
                    ) : (  
                        <div className="w-full h-full bg-secondary flex items-center justify-center font-bold text-sm"> 
                            {user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs">@{user?.username}</p>
                </div>
            </Link>
        </div>
        <nav className="p-2">
            {settingsMenu.map(({ url, name, icon: Icon }, i) => {
                    const isActive = path === url;
                    return (
                      <Link key={i} href={url} className={`text-xs relative transition duration-300 flex items-center gap-3 ${isActive ? 'bg-primary/10 text-primary' : 'hover:text-primary hover:bg-primary/10'} rounded-lg px-3 py-2`}>
                        <Icon size={14}/>
                        {name}
                      </Link>
            )})}
        </nav>
    </aside>
}

export default SettingsSidebar