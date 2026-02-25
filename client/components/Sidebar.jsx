import { sideMenu } from "@/lib/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const path = usePathname()
  return (
    <aside className="md:sticky hidden md:block top-20 h-fit bg-background rounded-2xl border border-border p-4 space-y-2">
      {sideMenu.map(({ url, name, icon: Icon }, i) => {
        const isActive = path === url;
        return (
          <Link key={i} href={url} className={`relative transition duration-300 flex items-center gap-4 p-2 ${isActive ? 'text-primary' : 'hover:text-primary'}`}>
            <Icon />
            {name}
            {isActive && (
                  <div className="absolute left-0 w-0.5 h-full rounded-full bg-primary" />
                )}
          </Link>
      )})}
    </aside>
  );
};

export default Sidebar;
