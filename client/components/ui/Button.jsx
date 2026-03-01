export const Button = ({children , variant = 'DEFAULT' ,size = 'SM', className , href , ...props})=>{
    const BASE_STYLE = "border inline-flex items-center gap-2 rounded-md px-4 py-2 cursor-pointer transition duration-300"
    const VARIANTS = {
        DEFAULT : 'border-transparent bg-foreground text-background' ,
        PRIMARY : 'border-transparent bg-primary text-black',
        TRANSPARENT : 'border-transparent bg-transparent' ,
        OUTLINE : 'bg-transparent border-border' ,
        DESTRUCTIVE: 'border-transparent bg-red-600 text-white hover:bg-red-700 shadow-sm'
    }


    const SIZES = {
        SM: 'px-3 py-1.5 text-xs',
        MD: 'px-4 py-2 text-sm',
        LG: 'px-6 py-4 text-lg md:text-base',
        XL: 'w-full py-4 text-lg'
    };


    const activeVariant = VARIANTS[variant.toUpperCase()] || VARIANTS.DEFAULT;
    const activeSize = SIZES[size.toUpperCase()] || SIZES.MD;

    const finalClasses = `${BASE_STYLE} ${activeVariant} ${activeSize} ${className}`;
    if(href){
        return <a href={href} {...props} className={finalClasses}>
                        {children}
        </a>
    }
    return <button {...props} className={finalClasses}>
                        {children}
    </button>
}