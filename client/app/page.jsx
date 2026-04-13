'use client'

import { GlowBackground } from "@/components/GlowBackground"
import Features from "@/components/sections/Features"
import Hero from "@/components/sections/Hero"
import { Button } from "@/components/ui/Button"
import LanguageSwitcher from "@/components/ui/LanguageSwitcher"
import { Code2 } from "lucide-react"
import Link from "next/link"
import Footer from "../components/sections/Footer"

const Home = ()=>{
    return <>
        <header className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border px-3 md:px-10 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Code2 size={14}/>
                    </div>
                    <h3 className="text-xl font-bold text-xs sm:text-base">
                        Codify<span className="text-primary">Dev</span> 
                    </h3>
                </Link>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher/>
                    <Button href="/auth">Get started</Button>
                </div>
        </header>

        <main>
            <Hero/>
            <Features/>
            {/* <GlowBackground/>         */}
            <Footer/>
        </main>

    </>
}

export default Home