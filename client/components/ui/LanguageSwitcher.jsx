'use client'
import { useLang } from "@/hooks/useLang";
import { setCurrentLang } from "@/store/features/lang/langSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const LanguageSwitcher = () => {
  const dispatch = useDispatch()
  const { currentLang } = useLang()
  useEffect(()=>{
    const savedLang = localStorage.getItem('lang')
    if (savedLang) dispatch(setCurrentLang(savedLang))
    else dispatch(setCurrentLang('en'))
  } , [])

  useEffect(() => {
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    
    localStorage.setItem('lang', currentLang);
  }, [currentLang]);

  const handleChange = (event) => {
    dispatch(setCurrentLang(event.target.value))
  };

  const languages = [
    { flag: '🇺🇸', label: 'English', code: 'en' },
    { flag: '🇫🇷', label: 'Français', code: 'fr' },
    { flag: '🇲🇦', label: 'العربية', code: 'ar' }
  ];

  return (
    <div className="p-2">
      <select 
        value={currentLang} 
        onChange={handleChange}
        className="bg-background text-foreground border-none outline-none cursor-pointer"
      >
        {languages.map((l) => (
          <option value={l.code} key={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;