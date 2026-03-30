import React from "react";
import { Coffee, Loader2, MapPin, Edit3, Trash2, Search, ArrowUpRight, Hash, Globe, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoffeeItem } from "../lib/api.js";

interface DiscoveryProps {
  loading: boolean;
  filteredCoffees: CoffeeItem[];
  selectedRoast: string;
  setSelectedRoast: (r: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAdd: () => void;
  onEdit: (coffee: CoffeeItem) => void;
  onDelete: (id: number) => void;
  onView: (coffee: CoffeeItem) => void;
}

export default function Discovery({ 
  loading, filteredCoffees, selectedRoast, setSelectedRoast, 
  searchQuery, setSearchQuery, onAdd, onEdit, onDelete, onView 
 }: DiscoveryProps) {
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.div key="discovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative bg-[var(--bg-color)]">
      
      {/* 🍱 REFINED SEARCH & ANALYTICS BAR (Flat Minimal) */}
      <section className="sticky top-[70px] z-[100] bg-[var(--bg-color)]/95 backdrop-blur-3xl border-b border-[var(--border-color)]/20 px-6 sm:px-10 py-10 transition-all duration-500">
         <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col lg:flex-row items-center gap-10 justify-between">
               <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
                  <div className="flex gap-1.5 bg-[var(--input-bg)]/50 p-1 rounded-[4px] border border-[var(--border-color)]/20 overflow-x-auto no-scrollbar max-w-full">
                     {["All Roasts", "Light", "Medium", "Dark"].map(r => (
                       <button 
                         key={r} 
                         onClick={() => setSelectedRoast(r)} 
                         className={`px-8 py-2.5 text-[8.5px] font-black uppercase tracking-normal rounded-[3px] transition-all whitespace-nowrap cursor-pointer ${selectedRoast === r ? "bg-indigo-600 text-white shadow-xl" : "text-[var(--text-secondary)] hover:text-white"}`}
                       >
                         {r}
                       </button>
                     ))}
                  </div>
                  <div className="relative group w-full sm:w-[480px] h-[52px] flex items-center">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 opacity-20" />
                     <input 
                       value={searchQuery} 
                       onChange={(e) => setSearchQuery(e.target.value)} 
                       placeholder="Search batch registry..." 
                       className="w-full h-full bg-[var(--input-bg)]/40 border border-[var(--border-color)]/20 rounded-[4px] py-0 pl-14 pr-8 text-[10px] font-black uppercase tracking-normal focus:border-indigo-500/50 outline-none transition-all placeholder:opacity-10" 
                     />
                  </div>
               </div>
            </div>

            {/* Quick Registry Metrics */}
            <div className="flex items-center gap-10 opacity-30">
               <div className="flex items-center gap-3">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase tracking-normal">{filteredCoffees.length} Batches listed</span>
               </div>
               <div className="flex items-center gap-3">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-black uppercase tracking-normal">Global Origins Indexed</span>
               </div>
            </div>
         </div>
      </section>

      {/* 💎 HIGH-FIDELITY INVENTORY GRID */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-48">
         {loading ? (
            <div className="py-48 flex flex-col items-center justify-center gap-6">
               <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
               <p className="text-[9px] font-black uppercase tracking-normal text-[var(--text-secondary)] font-sans">Synchronizing Index</p>
            </div>
         ) : filteredCoffees.length === 0 ? (
           <div className="py-40 text-center space-y-8 max-w-sm mx-auto opacity-20">
              <Coffee className="w-16 h-16 mx-auto" />
              <div className="space-y-2">
                 <h3 className="text-3xl font-black uppercase tracking-normal">Registry.Zero</h3>
                 <p className="text-[8px] font-black uppercase tracking-normal underline underline-offset-4">No results in active curation</p>
              </div>
           </div>
         ) : (
           <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-20 gap-y-32"
           >
              {filteredCoffees.map(c => (
                <motion.div key={c.id} variants={item} className="group relative">
                   
                   <div className="space-y-10">
                      {/* Premium Photographic Surface */}
                      <div 
                        onClick={() => onView(c)} 
                        className="aspect-[4/5.5] relative overflow-hidden bg-black rounded-[4px] cursor-pointer border border-[var(--border-color)]/20 transition-all duration-700 hover:border-indigo-500/30 group-hover:shadow-[0_40px_80px_-40px_rgba(79,70,229,0.25)]"
                      >
                         <img 
                           src={c.image_url} 
                           className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[1200ms] group-hover:scale-105" 
                           alt={c.name} 
                         />
                         
                         {/* High-Fidelity Labels */}
                         <div className="absolute inset-0 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                               <div className="bg-black/90 backdrop-blur-2xl border border-white/5 px-4 py-2 rounded-[2px] text-[8.5px] font-black uppercase tracking-normal text-white">
                                  {c.roast_level}
                               </div>
                               <button className="w-12 h-12 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center shadow-2xl">
                                  <ArrowUpRight className="w-6 h-6" />
                               </button>
                            </div>
                            
                            {/* Sleek Minimalist Stock & Price Hub */}
                            <div className="space-y-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                               <div className="flex items-center gap-2">
                                  <div className="bg-indigo-600 px-4 py-2 rounded-[3px] shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)]">
                                     <span className="text-[14px] font-black text-white">${c.price.toFixed(2)}</span>
                                     <span className="ml-2 text-[7px] font-black text-white/50 uppercase tracking-normal">USD</span>
                                  </div>
                                  <div className={`px-4 py-2 rounded-[3px] border border-white/10 backdrop-blur-3xl ${Math.max(0, c.quantity - c.sold_count) <= 5 ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white/60"}`}>
                                     <span className="text-[9px] font-black">{Math.max(0, c.quantity - c.sold_count)}</span>
                                     <span className="ml-2 text-[6px] font-black uppercase">Left</span>
                                  </div>
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-normal text-white/50">{c.origin}</p>
                            </div>
                         </div>

                         {/* Surface Gradient Recovery */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-1000" />
                      </div>

                      {/* Typographic Metadata Refinery */}
                      <div className="space-y-6">
                         <div onClick={() => onView(c)} className="cursor-pointer space-y-4">
                            <div className="flex items-center gap-4 group-hover:gap-6 transition-all duration-500">
                               <span className="text-[8px] font-black uppercase tracking-normal text-indigo-500">Batch_Index_{c.id}</span>
                               <div className="flex-1 h-px bg-indigo-500/10" />
                            </div>
                            
                            <div className="space-y-1">
                               {/* Balanced High-Density Title */}
                               <h4 className="text-3xl sm:text-[2.25rem] font-bold uppercase transition-all group-hover:text-indigo-500 tracking-normal leading-[0.9] text-[var(--text-primary)]">
                                  {c.name}
                               </h4>
                               <p className="text-[11px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-normal italic font-serif leading-none pt-1">{c.brand}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-3">
                               <MapPin className="w-4 h-4 text-indigo-500 opacity-60" />
                               <p className="text-[9px] font-black uppercase tracking-normal text-[var(--text-secondary)]">{c.origin}</p>
                            </div>
                         </div>

                         {/* Interactive Curation Suite */}
                         <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-color)]/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 translate-y-2 group-hover:translate-y-0">
                            <button onClick={() => onEdit(c)} className="flex-1 h-[52px] rounded-[4px] border border-[var(--border-color)]/40 bg-[var(--input-bg)]/20 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-normal hover:bg-black hover:text-white transition-all cursor-pointer">
                               <Edit3 className="w-4 h-4" />
                               Refine
                            </button>
                            <button onClick={() => onDelete(c.id)} className="w-[52px] h-[52px] rounded-[4px] border border-[var(--border-color)]/40 flex items-center justify-center text-red-500/60 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer">
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   </div>

                </motion.div>
              ))}
           </motion.div>
         )}
      </section>
    </motion.div>
  );
}
