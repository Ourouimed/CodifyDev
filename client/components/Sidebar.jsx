import { sideMenu } from "@/lib/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const path = usePathname()
  return (
    <aside className="md:sticky top-20 h-fit bg-background rounded-lg border border-border p-4 space-y-2">
      {sideMenu.map(({ url, name, icon: Icon }, i) => (
        <Link key={i} href={url} className={`flex items-center gap-4 p-2 rounded-md`}>
          <Icon />
          {name}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
