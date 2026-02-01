export const TextArea = ({ icon: Icon, ...props }) => {
  return (
    <div className="group w-full border border-border py-2 px-4 rounded-md flex items-center gap-4 
                    transition duration-300
                    focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      
      {Icon && <Icon className="text-border transition-colors duration-200 
                                 group-focus-within:text-primary" />}
      
      <textarea className="outline-none w-full bg-transparent text-sm resize-none h-20" {...props} />
    </div>
  );
};