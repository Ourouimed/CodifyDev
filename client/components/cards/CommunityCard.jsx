import Link from "next/link";
import { Button } from "../ui/Button";
import { Lock, LockOpen, Users } from "lucide-react";

const CommunityCard = ({ community }) => {
  return (
    <div 
      className="group flex flex-col gap-4 border border-border rounded-2xl p-5 hover:border-primary transition-all duration-300 bg-card shadow-sm hover:shadow-md"
    >

      {/* Middle Section: Profile Image & Identity */}
      <div className="flex items-center gap-4">
        {/* Square Profile Image */}
        <div className="relative shrink-0 w-16 h-16 overflow-hidden rounded-xl border border-border group-hover:border-primary/30 transition-colors">
          {community.communityImage ? (
            <img 
              src={community.communityImage} 
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xl font-bold">
              {community.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg capitalize font-bold truncate group-hover:text-primary transition-colors">
            {community.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Created {new Date(community.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Description Section */}
      {community.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">
          {community.description}
        </p>
      )}


      <div className="inline-flex gap-3">
        <span className={`inline-flex items-center gap-1 text-xs ${community.visibility === 'public' ? "bg-green-500/10 text-green-500" :  "bg-red-500/10 text-red-500"} py-2 px-3 rounded-md`}>
            {community.visibility === 'public' ? <LockOpen size={14}/> : <Lock size={14}/>} {community.visibility}
        </span>


        <span className={`inline-flex items-center gap-1 text-xs bg-primary/10 text-primary py-2 px-3 rounded-md`}>
            <Users size={14}/> {community.members.length} members
        </span>

      </div>

      {/* Action Button */}
      <Button 
        href={`/communities/${community._id}`} 
        size="sm" 
        className="w-full mt-2 justify-center rounded-lg font-medium"
      >
        View Community
      </Button>
    </div>
  );
};

export default CommunityCard;