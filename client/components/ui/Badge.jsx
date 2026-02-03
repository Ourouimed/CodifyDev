export const Badge = ({ text, icon: Icon }) => {
    return (
        <span className="py-1 px-2.5 rounded-full inline-flex gap-1.5 items-center bg-primary/10 border border-primary/20 text-xs font-medium">
            {Icon && (
                <Icon size={12} className="text-primary" />
            )}
            {text}
        </span>
    )
}