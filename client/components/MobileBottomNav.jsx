"use client";
import { sideMenu } from '../lib/links';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <div className='fixed bottom-4 left-0 right-0 px-4 md:hidden z-50'>

      <nav className='bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-2xl max-w-md mx-auto overflow-hidden'>
        <div className='flex justify-around items-center h-16 px-2'>
          {sideMenu.map(({url , name, icon : Icon}) => {
            const isActive = pathname === url;

            return (
              <Link 
                key={url} 
                href={url} 
                className={`transition duration-300 flex flex-col items-center justify-center flex-1 min-w-0 h-full group relative rounded-full`}
              >
                {isActive && (
                  <div className="absolute bottom-0 w-1 h-1 w-full rounded-full bg-primary" />
                )}

                <Icon 
                  className={`w-5 h-5 mb-1 flex-shrink-0 transition-transform duration-300 ${
                    isActive ? 'text-primary scale-110' : 'group-hover:text-primary'
                  }`} 
                />
                <span className={`text-[10px] font-medium truncate w-full text-center px-1 transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'group-hover:text-primary'
                }`}>
                  {name}
                </span>

              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileBottomNav;