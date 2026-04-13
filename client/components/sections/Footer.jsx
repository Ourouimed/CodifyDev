import React from 'react';
import { Github, Twitter, Linkedin, Terminal, Activity, Code2 } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-white">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Code2 size={14}/>
                    </div>
                    <h3 className="text-xl font-bold text-xs sm:text-base">
                        Codify<span className="text-primary">Dev</span> 
                    </h3>
                </Link>
            <p className="text-sm leading-relaxed mb-6">
              The professional network built for builders. Share snippets, 
              collaborate on repos, and grow your engineering career.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Feed</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Projects</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Snippets</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Job Board</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Open Source</a></li>
            </ul>
          </div>

          {/* Status & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 rounded-md border border-white/5 w-fit">
              <Activity size={14} className="text-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-500">All Systems Operational</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="git push updates..." 
                className="bg-transparent border border-white/10 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 w-full"
              />
              <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-[11px] font-mono tracking-tight">
            &copy; {currentYear} DevSocial Inc. Made with &lt;/&gt; by developers.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span className="text-gray-600">v2.4.0-stable</span>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;