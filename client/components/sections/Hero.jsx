import { Github, Terminal } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { langs } from "@/lib/languages";
import { useLang } from "@/hooks/useLang";
import { useEffect, useState } from "react";

const Hero = () => {
  const { currentLang } = useLang();
  const t = langs[currentLang]?.landing_page?.hero;

  const [activityData , setActivityData] = useState([])

  useEffect(()=>{
    const data = Array.from({ length: 105 }, () => ({
      level: Math.floor(Math.random() * 4), 
    }));
    setActivityData(data)
  } , [])
  const getIntensity = (level) => {
    switch (level) {
      case 1: return "bg-emerald-900";
      case 2: return "bg-emerald-600";
      case 3: return "bg-emerald-400";
      default: return "bg-gray-300 dark:bg-gray-800";
    }
  };

  return (
    <section id="hero" className="relative py-20 px-6 md:p-10 min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* --- Blurry Circle Decoration --- */}
      <div 
        className="absolute -top-24  w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" 
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full max-w-7xl mx-auto relative z-10">
        
        {/* Content Section */}
        <div className="space-y-4 order-2 lg:order-1">
          <div className="flex justify-center lg:justify-start">
             <Badge text={t?.badge} icon={Terminal} />
          </div>

          <h1 className="text-2xl md:text-5xl font-black tracking-tighter leading-tight text-center lg:text-start">
            {t?.h1?.main}{" "}
            <span className="text-primary">{t?.h1?.spam}</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base text-center lg:text-start max-w-xl mx-auto lg:mx-0">
            {t?.p}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <Button href='/auth'>{t?.buttons?.get_started}</Button>
            <Button href='https://github.com/Ourouimed/CodifyDev' target="_blank" variant="outline">
              {t?.buttons?.contribute} <Github size={18} className="ml-2"/>
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex items-center justify-center lg:justify-end w-full">
          <div className="relative group w-full max-w-lg"> 
            
            <div className="relative bg-background border border-border shadow-2xl rounded-xl overflow-hidden w-full">
              {/* Window Header */}
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="size-2.5 bg-red-500/80 rounded-full"/>
                  <div className="size-2.5 bg-yellow-500/80 rounded-full"/>
                  <div className="size-2.5 bg-green-500/80 rounded-full"/>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest">Activity Feed</span>
              </div>

              {/* Grid Content */}
              <div className="p-4 md:p-6">
                <div className="grid grid-flow-col grid-rows-7 gap-1 md:gap-1.5 w-full">
                  {activityData.map((day, i) => (
                    <div 
                      key={i} 
                      className={`w-full aspect-square rounded-[15%] transition-colors duration-500 ${getIntensity(day.level)}`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-end gap-2 text-[10px] md:text-[11px] text-muted-foreground font-medium">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="size-2.5 md:size-3 bg-slate-800 rounded-[2px]" />
                    <div className="size-2.5 md:size-3 bg-emerald-900 rounded-[2px]" />
                    <div className="size-2.5 md:size-3 bg-emerald-600 rounded-[2px]" />
                    <div className="size-2.5 md:size-3 bg-emerald-400 rounded-[2px]" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;