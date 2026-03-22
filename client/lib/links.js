import { 
  Home, 
  Users, 
  Briefcase, 
  LayoutGrid, 
  Calendar,
  Search
} from "lucide-react";

export const sideMenu = [
    {
        url: '/feed',
        icon: Home, 
        name: "Home"
    },
    {
        url: '/Events',
        icon: Calendar, 
        name: "Events"
    },
    {
        url: '/communities',
        icon: Users, 
        name: "Communities"
    },
    {
        url: '/search',
        icon: Search, 
        name: "Search"
    },
];


export const settingsMenu = [
    {
        url: '/settings/profile',
        icon: LayoutGrid, 
        name: "Profile"
    } ,
    {
        url: '/settings/account',
        icon: Briefcase,
        name: "Account"
    },
]