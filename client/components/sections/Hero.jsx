import { Github, Terminal } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { langs } from "@/lib/languages";
import { useLang } from "@/hooks/useLang";
const Hero = () => {
  const { currentLang } = useLang()
  const t = langs[currentLang]?.landing_page?.hero;
  return (
    <section id="hero" className="relative py-20 px-6 md:p-10 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="grid grid-cols-1 col-reverse lg: lg:grid-cols-2 gap-10 items-center w-full">
        
        {/* Content Section */}
        <div className="space-y-4 order-2 lg:order-1">
          <div className="flex justify-center lg:justify-start">
             <Badge text={t?.badge} icon={Terminal} />
          </div>

          <h1 className="text-2xl md:text-5xl font-black tracking-tighter leading-tight text-center lg:text-start">
            {t?.h1?.main}{" "}
            <span className="text-primary">{t?.h1?.spam}</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base text-center lg:text-start">
            {t?.p}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <Button href='/auth'>{t?.buttons?.get_started}</Button>
            <Button href='https://github.com/Ourouimed/CodifyDev' target="_blank" variant="outline">
              {t?.buttons?.contribute} <Github size={18} className="ml-2"/>
            </Button>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;