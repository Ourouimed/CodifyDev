export const Button = ({children , variant = 'DEFAULT' , className , href , ...props})=>{
    const BASE_STYLE = "border inline-flex items-center gap-2 rounded-md px-4 py-2 cursor-pointer transition duration-300"
    const VARIANTS = {
        DEFAULT : 'border-transparent bg-foreground text-background' ,
        PRIMARY : 'border-transparent bg-primary text-black',
        TRANSPARENT : 'border-transparent bg-transparent' ,
        OUTLINE : 'bg-transparent border-border' ,
        DESTRUCTIVE: 'border-transparent bg-red-600 text-white hover:bg-red-700 shadow-sm'
    }
    if(href){
        return <a href={href} {...props} className={`${BASE_STYLE} ${VARIANTS[variant.toUpperCase()]} ${className}`}>
                        {children}
        </a>
    }
    return <button {...props} className={`${BASE_STYLE} ${VARIANTS[variant.toUpperCase()]} ${className}`}>
                        {children}
    </button>
}