import React, { useState, useEffect, useRef } from "react";
import { Menu, Moon, Sun, User, LogOut, Coffee, ChevronDown, Shield, Layout, ExternalLink, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "../lib/api.js";

interface HeaderProps {
  user: UserProfile | null;
  activeView: "discovery" | "persona";
  setActiveView: (v: "discovery" | "persona") => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (o: boolean) => void;
  settingsTab: string;
  onAuth: () => void;
  onLogout: () => void;
  eventsLogged?: number;
}

export default function Header(props: HeaderProps) {
  const { user, activeView, setActiveView, theme, setTheme, isSidebarOpen, setIsSidebarOpen, settingsTab, onAuth, onLogout, eventsLogged } = props;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] h-[70px] bg-[var(--bg-color)]/60 backdrop-blur-2xl px-6 sm:px-10 flex items-center justify-between border-b border-[var(--border-color)]">
      <div className="flex items-center gap-6 h-full">
         {/* SIDEBAR TOGGLE (Only in Console) */}
         {activeView === "persona" && (
           <>
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className="w-10 h-10 border border-[var(--border-color)] hover:border-indigo-500 rounded-[5px] flex items-center justify-center transition-all group cursor-pointer"
             >
                <Menu className="w-4 h-4 group-hover:text-indigo-500" />
             </button>
             <div className="h-4 w-px bg-[var(--border-color)]" />
           </>
         )}

         {/* BRAND / LOGO */}
         <div onClick={() => { setActiveView("discovery"); setIsProfileOpen(false); }} className="flex items-center gap-4 cursor-pointer group h-full whitespace-nowrap">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-[5px] animate-pulse" />
            <div className="flex flex-col -space-y-0.5">
               <p className="text-[9px] font-black uppercase tracking-[0.4em]">Noir Roastery</p>
               {activeView === "persona" && <p className="text-[7px] font-black uppercase text-indigo-500 tracking-[0.2em] opacity-80 hidden sm:block">Dashboard Console</p>}
            </div>
         </div>
      </div>

      <div className="flex items-center gap-4 h-full relative">
         {/* USER DROPDOWN TRIGGER */}
         {user ? (
           <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 transition-all cursor-pointer group"
              >
                 <div className="w-8 h-8 rounded-[5px] bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black group-hover:bg-black transition-all shadow-lg shadow-indigo-500/10">
                    {user.name?.[0]}
                 </div>
                 <ChevronDown className={`w-2.5 h-2.5 text-[var(--text-secondary)] transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                 {isProfileOpen && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(10px)" }}
                     animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                     exit={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(10px)" }}
                     transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                     className="absolute right-0 top-[calc(100%+12px)] w-60 bg-[var(--bg-color)] border border-[var(--border-color)]/60 rounded-[5px] shadow-2xl shadow-black/20 backdrop-blur-3xl overflow-hidden z-[200]"
                   >
                      {/* IDENTIFIER */}
                      <div className="p-5 border-b border-[var(--border-color)] bg-[var(--input-bg)]/30">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[5px] bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black text-xs">
                               {user.name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[10px] font-black uppercase truncate">{user.name}</p>
                               <p className="text-[7px] font-bold text-[var(--text-secondary)] uppercase tracking-wider truncate">{user.email}</p>
                            </div>
                         </div>
                      </div>

                      {/* NAV ACTIONS */}
                      <div className="p-2">
                         <button 
                           onClick={() => { setActiveView(activeView === "discovery" ? "persona" : "discovery"); setIsProfileOpen(false); }}
                           className="w-full flex items-center justify-between px-4 py-3 rounded-[5px] text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500/5 text-[var(--text-primary)] hover:text-indigo-500 transition-all cursor-pointer group"
                         >
                            <div className="flex items-center gap-3">
                               {activeView === "discovery" ? <Layout className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                               {activeView === "discovery" ? "Access Console" : "Return to Discovery"}
                            </div>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </button>

                         <button 
                           onClick={() => { setActiveView("persona"); setIsProfileOpen(false); }}
                           className="w-full flex items-center justify-between px-4 py-3 rounded-[5px] text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500/5 text-[var(--text-primary)] hover:text-indigo-500 transition-all cursor-pointer group"
                         >
                            <div className="flex items-center gap-3">
                               <Shield className="w-3.5 h-3.5" />
                               Account Integrity
                            </div>
                         </button>

                         <button 
                           onClick={() => setIsProfileOpen(false)}
                           className="w-full flex items-center justify-between px-4 py-3 rounded-[5px] text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500/5 text-[var(--text-primary)] hover:text-indigo-500 transition-all cursor-pointer group"
                         >
                            <div className="flex items-center gap-3">
                               <Activity className="w-3.5 h-3.5" />
                               Audit Logs
                            </div>
                         </button>
                      </div>

                      {/* SIGNAL ACTIONS */}
                      <div className="p-2 border-t border-[var(--border-color)] bg-[var(--input-bg)]/20">
                         <button 
                           onClick={() => { onLogout(); setIsProfileOpen(false); }}
                           className="w-full flex items-center gap-3 px-4 py-3 rounded-[5px] text-[9px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                         >
                            <LogOut className="w-3.5 h-3.5" />
                            Archive Session
                         </button>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
         ) : (
           <button onClick={onAuth} className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500 transition-all cursor-pointer border border-indigo-500/20 px-5 py-2.5 rounded-[5px] hover:bg-indigo-500 hover:text-white whitespace-nowrap">
              Identity Verification
           </button>
         )}
      </div>
    </nav>
  );
}
