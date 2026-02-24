import { 
  Home, 
  Users, 
  Code2, 
  Briefcase, 
  LayoutGrid, 
  Calendar
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
        url: '/snippets',
        icon: Code2, 
        name: "Code Snippets"
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