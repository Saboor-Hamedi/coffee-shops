import React, { useState, useEffect } from "react";
import { User, ShieldCheck, BarChart3, Database, LogOut, Loader2, Save, TrendingUp, CreditCard, Coffee, PackageCheck, ShoppingBag, HardDrive, Sun, Moon, LayoutGrid, Library, Settings, RefreshCcw, Globe, Edit3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile, CoffeeItem } from "../lib/api.js";

interface ConsoleProps {
  user: UserProfile | null;
  coffees: CoffeeItem[];
  analytics: { order_count: number; orders: any[] } | null;
  settingsTab: string;
  setSettingsTab: (tab: any) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onUpdateUser: (u: any) => void;
  onEdit: (c: CoffeeItem) => void;
  onDelete: (id: number) => void;
  showNotification: (msg: string, type?: "success" | "error") => void;
  isMobile: boolean;
  setActiveView: (view: "discovery" | "persona") => void;
  handleLogout: () => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  newName: string;
  setNewName: (name: string) => void;
  newPassword: string;
  setNewPassword: (p: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (p: string) => void;
  oldPassword: string;
  setOldPassword: (p: string) => void;
  profileError: string | null;
  isSubmitting: boolean;
  STYLES: any;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export default function Console(props: ConsoleProps) {
  const { 
    user, coffees, analytics, settingsTab, setSettingsTab, 
    isSidebarOpen, setIsSidebarOpen, isMobile, 
    handleLogout, handleUpdateProfile, newName, setNewName, 
    newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword, 
    oldPassword, setOldPassword, profileError, isSubmitting, STYLES, theme, setTheme,
    onEdit, onDelete
  } = props;

  const [showErrors, setShowErrors] = useState(false);

  // UI Fix: Reset error visibility when switching modules
  useEffect(() => {
    setShowErrors(false);
  }, [settingsTab]);

  const TABS = [
    { id: "identity", label: "PROFILE", icon: User, desc: "Curator handle & metadata" }, 
    { id: "security", label: "Security", icon: ShieldCheck, desc: "Credential hardening" }, 
    { id: "posts", label: "Registry", icon: Database, desc: "Master batch management" },
    { id: "analytics", label: "Intelligence", icon: BarChart3, desc: "Market flow & volume" }, 
    { id: "archival", label: "Archival", icon: Library, desc: "System lifecycle management" },
    { id: "theme", label: "Vision", icon: Sun, desc: "Interface aesthetics" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    handleUpdateProfile(e);
  };

  // 🍱 UNIFIED INPUT ARCHITECTURE (Absolute Consistency)
  const InputField = ({ label, value, type = "text", onChange, errorMsg, isRequired = true }: any) => {
     const hasError = showErrors && isRequired && !value.trim();
     return (
       <div className="space-y-1.5 w-full">
          <label className="text-[8px] font-black uppercase tracking-normal text-[var(--text-secondary)]">{label}</label>
          <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-transparent border-t-0 border-x-0 rounded-none px-0 border-b-2 py-2 text-base font-black outline-none transition-all duration-200 uppercase
              ${hasError ? 'border-red-500 text-red-500' : 'border-[var(--border-color)]/40 focus:border-indigo-500'}
            `}
          />
          <div className="h-4 flex items-start">
             {hasError && <p className="text-[8px] text-red-500 font-black uppercase tracking-normal leading-none">Fill this input *</p>}
             {errorMsg && !hasError && <p className="text-[8px] text-red-500 font-black uppercase tracking-normal leading-none">{errorMsg}</p>}
          </div>
       </div>
     );
  };

  return (
    <div key="persona-root" className="fixed inset-0 z-[150] bg-[var(--bg-color)] flex overflow-hidden pt-[70px]">
       {/* GLASS SIDEBAR (Compact) */}
       <motion.aside 
         initial={false}
         animate={{ 
           width: isSidebarOpen ? (isMobile ? "100%" : "260px") : "0px",
           x: isSidebarOpen ? 0 : (isMobile ? -window.innerWidth : 0)
         }}
         className="h-full border-r border-[var(--border-color)] bg-[var(--input-bg)]/20 backdrop-blur-3xl relative z-20 overflow-hidden flex flex-col"
       >
          <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-1">
             {TABS.map(tab => (
               <button 
                 key={tab.id} 
                 onClick={() => { setSettingsTab(tab.id as any); if(isMobile) setIsSidebarOpen(false); }} 
                 className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-[4px] transition-all duration-200 cursor-pointer ${settingsTab === tab.id ? "bg-indigo-500 text-white" : "text-[var(--text-secondary)] hover:bg-white/5"}`}
               >
                  <tab.icon className={`w-3 h-3 transition-transform duration-300 ${settingsTab === tab.id ? "scale-110" : ""}`} />
                  <div className="flex flex-col items-start leading-none gap-1">
                     <span className="text-[8.5px] font-black uppercase tracking-normal">{tab.label}</span>
                     <span className={`text-[6px] font-bold uppercase tracking-normal opacity-40 ${settingsTab === tab.id ? "text-indigo-100" : ""}`}>{tab.desc}</span>
                  </div>
                  {settingsTab === tab.id && <motion.div layoutId="active-ind" className="absolute left-0 w-0.5 h-3.5 bg-white rounded-full -ml-0.25" />}
               </button>
             ))}
          </div>

          <div className="p-4 border-t border-[var(--border-color)]">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-indigo-500 text-white flex items-center justify-center font-black text-[9px]">
                   {user?.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[8px] font-black uppercase truncate tracking-normal">{user?.name}</p>
                   <p className="text-[6.5px] font-bold text-[var(--text-secondary)] uppercase tracking-normal truncate">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1"><LogOut className="w-3 h-3" /></button>
             </div>
          </div>
       </motion.aside>

       {/* HIGH-DENSITY CONTENT AREA */}
       <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-[var(--bg-color)]">
          <div className="max-w-4xl mx-auto p-6 sm:p-10 lg:p-12 pb-32">
             <AnimatePresence mode="wait">
                {settingsTab === "identity" && (
                   <motion.div key="identity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-10">
                      <div className="space-y-1">
                         <p className="text-[7px] font-black uppercase tracking-normal text-indigo-500">System Descriptor</p>
                         <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-normal leading-none">Identity.</h1>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                         <div className="lg:col-span-3 p-6 border border-[var(--border-color)]/30 rounded-[4px] bg-[var(--input-bg)]/5 space-y-8">
                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                               <InputField 
                                 label="Username" 
                                 value={newName} 
                                 onChange={setNewName} 
                               />
                               <button type="submit" className="relative w-fit px-12 h-[45px] bg-indigo-600 hover:bg-black text-white rounded-[4px] text-[8.5px] font-black uppercase tracking-normal transition-all overflow-hidden cursor-pointer mt-4">
                                  <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                      <motion.div key="loader" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center">
                                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      </motion.div>
                                    ) : (
                                      <motion.span key="label" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                         Save Profile
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                               </button>
                            </form>
                         </div>
                         
                         <div className="p-6 border border-[var(--border-color)]/20 rounded-[4px] space-y-4 flex flex-col justify-center">
                            <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" />
                            <p className="text-[7px] font-black uppercase tracking-normal text-[var(--text-secondary)]">Status: Active</p>
                         </div>
                      </div>
                   </motion.div>
                )}

                 {settingsTab === "posts" && (
                    <motion.div key="registry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-10">
                       <div className="space-y-1">
                          <p className="text-[7px] font-black uppercase tracking-normal text-indigo-500">Archival Manifest</p>
                          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-normal leading-none">Registry.</h1>
                       </div>
                       
                       <div className="p-1 border border-[var(--border-color)]/30 rounded-[4px] bg-[var(--input-bg)]/5 overflow-hidden">
                          <div className="overflow-x-auto no-scrollbar">
                             <table className="w-full text-left border-collapse">
                                <thead>
                                   <tr className="border-b border-[var(--border-color)]/50">
                                      <th className="px-6 py-4 text-[7.5px] font-black uppercase tracking-normal text-[var(--text-secondary)]">Identifier</th>
                                      <th className="px-6 py-4 text-[7.5px] font-black uppercase tracking-normal text-[var(--text-secondary)]">Descriptor</th>
                                      <th className="px-6 py-4 text-[7.5px] font-black uppercase tracking-normal text-[var(--text-secondary)]">Stock</th>
                                      <th className="px-6 py-4 text-[7.5px] font-black uppercase tracking-normal text-[var(--text-secondary)]">Flow</th>
                                      <th className="px-6 py-4 text-[7.5px] font-black uppercase tracking-normal text-[var(--text-secondary)] text-right">Commit</th>
                                      <th className="px-6 py-4 text-[7.5px] font-black uppercase tracking-normal text-[var(--text-secondary)] text-right">Ops</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]/20">
                                   {coffees.map(c => {
                                     const remaining = Math.max(0, c.quantity - c.sold_count);
                                     return (
                                       <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                                          <td className="px-6 py-4">
                                             <div className="flex flex-col gap-1.5">
                                                <span className="text-[8px] font-black font-mono text-indigo-500 whitespace-nowrap">ID_0{c.id}</span>
                                                <span className={`text-[6px] font-bold px-1.5 py-0.5 rounded-[2px] w-fit ${c.is_public === 1 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                                   {c.is_public === 1 ? "PUBLISHED" : "PRIVATE"}
                                                </span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4">
                                             <div className="flex flex-col">
                                                <span className="text-[9.5px] font-black uppercase tracking-normal">{c.name}</span>
                                                <span className="text-[7px] font-bold text-[var(--text-secondary)] uppercase">{c.brand}</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4">
                                             <div className="flex flex-col">
                                                <div className="flex items-baseline gap-1">
                                                   <span className={`text-[10px] font-black ${remaining <= 5 ? "text-red-500" : "text-[var(--text-primary)]"}`}>{remaining}</span>
                                                   <span className="text-[7px] font-black text-[var(--text-secondary)]">/ {c.quantity}</span>
                                                </div>
                                                <span className="text-[6px] font-bold text-[var(--text-secondary)] uppercase tracking-normal">Units Avail</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4">
                                             <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-indigo-500">{c.sold_count}</span>
                                                <span className="text-[6px] font-bold text-[var(--text-secondary)] uppercase tracking-normal">Sold Total</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                             <span className="text-[10px] font-serif italic text-indigo-500">${c.price.toFixed(2)}</span>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onEdit(c)} className="p-2 border border-[var(--border-color)]/50 rounded-[3px] hover:bg-black hover:text-white transition-all cursor-pointer"><Edit3 className="w-2.5 h-2.5" /></button>
                                                <button onClick={() => onDelete(c.id)} className="p-2 border border-red-500/20 rounded-[3px] text-red-500/50 hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Trash2 className="w-2.5 h-2.5" /></button>
                                             </div>
                                          </td>
                                       </tr>
                                     );
                                   })}
                                </tbody>
                             </table>
                          </div>
                       </div>
                    </motion.div>
                 )}

                {settingsTab === "security" && (
                   <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-10">
                      <div className="space-y-1">
                         <p className="text-[7px] font-black uppercase tracking-normal text-red-500">Encryption Layer</p>
                         <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-normal leading-none">Security.</h1>
                      </div>
                      
                      <div className="p-6 sm:p-8 border border-[var(--border-color)]/30 rounded-[4px] bg-[var(--input-bg)]/5 space-y-8 max-w-4xl">
                         {profileError && <p className="text-red-500 text-[8px] font-black uppercase tracking-normal text-center bg-red-500/5 py-3 border border-red-500/10 mb-6">{profileError}</p>}
                         <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                               <InputField 
                                 type="password"
                                 label="Password" 
                                 value={newPassword} 
                                 onChange={setNewPassword} 
                                 errorMsg={showErrors && newPassword && newPassword.length < 6 ? "Minimum 6 characters" : null}
                               />
                               <InputField 
                                 type="password"
                                 label="Confirm Password" 
                                 value={confirmNewPassword} 
                                 onChange={setConfirmNewPassword} 
                                 errorMsg={showErrors && confirmNewPassword && confirmNewPassword !== newPassword ? "Passwords do not match" : null}
                               />
                            </div>
                            <div className="pt-8 border-t border-[var(--border-color)]/50 space-y-6">
                               <InputField 
                                 type="password"
                                 label="Current Password (Verification Required)" 
                                 value={oldPassword} 
                                 onChange={setOldPassword} 
                               />
                               <button type="submit" className="relative w-fit px-12 h-[45px] bg-indigo-600 hover:bg-black text-white rounded-[4px] text-[8.5px] font-black uppercase tracking-normal transition-all overflow-hidden cursor-pointer">
                                  <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                      <motion.div key="loader" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-center">
                                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      </motion.div>
                                    ) : (
                                      <motion.span key="label" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                                         Update Password
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                               </button>
                            </div>
                         </form>
                      </div>
                   </motion.div>
                )}

                {settingsTab === "analytics" && (
                   <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-10">
                      <div className="space-y-1">
                         <p className="text-[7px] font-black uppercase tracking-normal text-indigo-500">Distribution Intelligence</p>
                         <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-normal leading-none">Intelligence.</h1>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {[
                           { label: "Market Volume", val: analytics?.order_count || 0, icon: TrendingUp },
                           { label: "Revenue USD", val: analytics?.orders.reduce((acc: any, o: any) => acc + o.total_price, 0).toFixed(0) || 0, icon: CreditCard },
                           { label: "Batches", val: coffees.length, icon: Coffee }
                         ].map((stat) => (
                           <div key={stat.label} className="p-6 border border-[var(--border-color)]/30 rounded-[4px] bg-[var(--input-bg)]/5 space-y-4">
                              <p className="text-[7px] font-black uppercase tracking-normal text-[var(--text-secondary)]">{stat.label}</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-3xl font-black tracking-normal">{stat.val}</p>
                                 <stat.icon className="w-3.5 h-3.5 text-indigo-500 opacity-40" />
                              </div>
                           </div>
                         ))}
                      </div>

                      <div className="p-6 border border-[var(--border-color)]/30 rounded-[4px] space-y-6">
                         <h3 className="text-lg font-black uppercase tracking-normal flex items-center gap-3">
                            <PackageCheck className="w-4 h-4 text-indigo-500" />
                            Log Feed
                         </h3>
                         <div className="space-y-1">
                            {analytics?.orders && analytics.orders.length > 0 ? (
                              analytics.orders.slice(0, 8).map((o: any) => (
                                <div key={o.id} className="flex items-center justify-between p-3 border-b border-[var(--border-color)]/40 hover:bg-white/5 transition-colors -mx-2 rounded-[4px]">
                                   <div>
                                      <p className="text-[8px] font-black">ID_0{o.id}</p>
                                      <p className="text-[7px] font-bold text-[var(--text-secondary)] uppercase tracking-normal">{new Date(o.created_at).toLocaleDateString()}</p>
                                   </div>
                                   <p className="text-base font-serif italic text-indigo-500">${o.total_price.toFixed(2)}</p>
                                </div>
                              ))
                            ) : (
                              <div className="py-16 text-center opacity-30">
                                 <ShoppingBag className="w-8 h-8 mx-auto mb-4" />
                                 <p className="text-[7px] font-black uppercase tracking-normal">Zero Activity</p>
                              </div>
                            )}
                         </div>
                      </div>
                   </motion.div>
                )}

                {settingsTab === "theme" && (
                   <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-10">
                      <div className="space-y-1">
                         <p className="text-[7px] font-black uppercase tracking-normal text-indigo-500">System Mode</p>
                         <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-normal leading-none">Vision.</h1>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                         {[
                           { id: "light" as const, label: "Pure Light", icon: Sun },
                           { id: "dark" as const, label: "Noir Dark", icon: Moon }
                         ].map(mode => (
                           <button 
                             key={mode.id}
                             onClick={() => setTheme(mode.id)}
                             className={`p-8 border rounded-[4px] transition-all text-left flex flex-col gap-4 cursor-pointer ${theme === mode.id ? "border-indigo-500 bg-indigo-500/5" : "border-[var(--border-color)]/30 hover:border-indigo-500/50"}`}
                           >
                              <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center ${theme === mode.id ? "bg-indigo-500 text-white" : "border border-[var(--border-color)]"}`}>
                                 <mode.icon className="w-4 h-4" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em]">{mode.label}</p>
                           </button>
                         ))}
                      </div>
                   </motion.div>
                )}

                {settingsTab === "archival" && (
                   <motion.div key="archival" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-10">
                      <div className="space-y-1">
                         <p className="text-[7px] font-black uppercase tracking-[0.4em] text-red-500">Lifecycle Operations</p>
                         <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none">Archival.</h1>
                      </div>
                      
                      <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-[4px] space-y-8 max-w-xl">
                         <div className="space-y-3 text-left">
                            <HardDrive className="w-8 h-8 text-red-500" />
                            <p className="text-base font-serif italic text-red-500 leading-relaxed">"Executing this sequence will terminate all active curator states."</p>
                         </div>
                         <button onClick={handleLogout} className="w-fit px-10 h-[45px] bg-red-500 hover:bg-black text-white rounded-[4px] text-[8.5px] font-black uppercase tracking-widest transition-all cursor-pointer">
                            Terminate
                         </button>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
}
