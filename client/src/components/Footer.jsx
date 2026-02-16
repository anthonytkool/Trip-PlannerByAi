import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/20 pt-8 pb-12 text-center relative z-10 animate-fade-in">
      <div className="glass-panel inline-flex items-center gap-3 px-6 py-3 rounded-full">
        <span className="text-slate-200 font-medium flex items-center gap-1.5">
          Made by <span className="text-white font-bold">Shashank</span>
        </span>
        <div className="h-4 w-px bg-slate-500"></div>
        <div className="flex gap-3">
          <a href="https://github.com/Shashank240924" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors transform hover:scale-110">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-slate-300 hover:text-blue-400 transition-colors transform hover:scale-110">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;