import React from "react";
import { Coffee, Loader2, MapPin, Edit3, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
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
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div key="discovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative bg-[var(--bg-color)]">
      
      {/* 🍱 SEARCH & FILTERS (Functional Command Center) */}
      <section className="sticky top-[70px] z-[100] bg-[var(--bg-color)]/80 backdrop-blur-xl border-b border-[var(--border-color)]/30 px-6 sm:px-10 py-8">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-8 justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
               <div className="flex gap-1.5 bg-[var(--input-bg)] p-1 rounded-[4px] border border-[var(--border-color)] overflow-x-auto no-scrollbar max-w-full">
                  {["All Roasts", "Light", "Medium", "Dark"].map(r => (
                    <button key={r} onClick={() => setSelectedRoast(r)} className={`px-6 py-2.5 text-[8.5px] font-black uppercase tracking-widest rounded-[4px] transition-all whitespace-nowrap cursor-pointer ${selectedRoast === r ? "bg-indigo-500 text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-indigo-500"}`}>{r}</button>
                  ))}
               </div>
               <div className="relative group w-full sm:w-[360px] h-[45px] flex items-center">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Batch Registry..." className="w-full h-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[4px] py-0 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:border-indigo-500 outline-none transition-all placeholder:opacity-30" />
               </div>
            </div>
            
            {/* Redundant Add Button Removed - Using Header Plus Action only */}
         </div>
      </section>

      {/* 💎 INVENTORY GRID */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
         {loading ? (
           <div className="py-20 flex flex-col items-center gap-4 text-[var(--text-secondary)]">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Synchronizing Registry...</p>
           </div>
         ) : filteredCoffees.length === 0 ? (
           <div className="py-20 text-center space-y-6">
              <Coffee className="w-12 h-12 mx-auto text-[var(--text-secondary)] opacity-10" />
              <div className="space-y-1">
                 <h3 className="text-2xl font-black uppercase tracking-tight leading-none text-red-500 opacity-50 text-center">Curation Void</h3>
                 <p className="text-[8.5px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50 text-center">No batch matches your high-fidelity criteria</p>
              </div>
           </div>
         ) : (
           <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20"
           >
              {filteredCoffees.map(c => (
                <motion.div key={c.id} variants={item} className="group space-y-5">
                   <div onClick={() => onView(c)} className="aspect-[4/5] relative overflow-hidden bg-[var(--input-bg)] rounded-[4px] cursor-pointer border border-[var(--border-color)]">
                      <img src={c.image_url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt={c.name} />
                      <div className="absolute top-4 left-4 bg-[var(--bg-color)]/95 backdrop-blur-md px-3 py-1.5 rounded-[4px] text-[8.5px] font-black uppercase tracking-widest text-indigo-500 shadow-xl">{c.roast_level}</div>
                   </div>
                   <div className="space-y-4">
                      <div onClick={() => onView(c)} className="cursor-pointer space-y-2">
                         <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500">Batch_0{c.id}</span>
                            <div className="flex-1 h-[1px] bg-[var(--border-color)]/20"></div>
                         </div>
                         <h4 className="text-lg font-black uppercase transition-colors group-hover:text-indigo-500 tracking-tighter leading-none">{c.name}</h4>
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-500" /> {c.origin}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-[var(--border-color)]/30 pt-4">
                         <p className="text-xl font-serif italic text-indigo-500 tracking-tighter">${c.price.toFixed(2)}</p>
                         <div className="flex gap-2">
                            <button onClick={() => onEdit(c)} className="w-10 h-10 rounded-[4px] border border-[var(--border-color)]/40 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(c.id)} className="w-10 h-10 rounded-[4px] border border-[var(--border-color)]/40 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-500 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
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
