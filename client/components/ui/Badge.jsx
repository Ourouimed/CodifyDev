export const Badge = ({text , icon : Icon})=>{
    return  <span className="py-2 px-4 rounded-full inline-flex gap-3 items-center bg-primary/20 border border-primary text-xs font-semibold">
                    <span className="bg-primary p-1 rounded-md">
                        {Icon && <Icon size={14}/>} 
                    </span>
                    {text}
                </span>
}