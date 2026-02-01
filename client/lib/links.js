import { 
  Home, 
  Users, 
  Code2, 
  Briefcase, 
  LayoutGrid, 
  Bell, 
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