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
  onEdit: (c: CoffeeItem) => void;
  onDelete: (id: number) => void;
  onView: (c: CoffeeItem) => void;
}

export default function Discovery({ 
  loading, filteredCoffees, selectedRoast, setSelectedRoast, 
  searchQuery, setSearchQuery, onAdd, onEdit, onDelete, onView 
}: DiscoveryProps) {
  return (
    <motion.div key="discovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="pt-32 sm:pt-44 pb-20 px-6 sm:px-10 relative overflow-hidden">
         <div className="max-w-7xl mx-auto space-y-10 relative z-10 text-center sm:text-left">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
               <p className="text-[9px] font-black uppercase tracking-[0.8em] text-indigo-500">Master Index 2026</p>
               <h1 className="text-5xl sm:text-[9rem] font-black tracking-tight leading-[0.8] text-[var(--text-primary)]">Discovery.</h1>
               <p className="max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] italic font-serif leading-relaxed mx-auto sm:mx-0">Exploration of unique batches and roastery insights.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
               <div className="flex gap-1 bg-[var(--input-bg)] p-1 rounded-[5px] border border-[var(--border-color)] overflow-x-auto no-scrollbar max-w-full">
                  {["All Roasts", "Light", "Medium", "Dark"].map(r => (
                    <button key={r} onClick={() => setSelectedRoast(r)} className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-[5px] transition-all whitespace-nowrap cursor-pointer ${selectedRoast === r ? "bg-indigo-500 text-white" : "text-[var(--text-secondary)] hover:text-indigo-500"}`}>{r}</button>
                  ))}
               </div>
               <div className="relative group w-full max-w-sm h-[32px] flex items-center">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-secondary)]" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full h-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[5px] py-0 pl-10 pr-6 text-[8px] font-black uppercase tracking-widest focus:border-indigo-500 outline-none transition-all" />
               </div>
            </motion.div>
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-32">
         {loading ? (
           <div className="py-20 flex flex-col items-center gap-4 text-[var(--text-secondary)]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /><p className="text-[9px] font-black uppercase tracking-[0.4em]">Loading...</p></div>
         ) : filteredCoffees.length === 0 ? (
           <div className="py-20 text-center space-y-6">
              <Coffee className="w-12 h-12 mx-auto text-[var(--text-secondary)] opacity-10" />
              <div className="space-y-1"><h3 className="text-2xl font-black uppercase tracking-tight leading-none">No Items Found</h3><p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50">Try an alternative search</p></div>
              <button onClick={onAdd} className="bg-indigo-500 hover:bg-black text-white px-8 py-3 rounded-[5px] text-[8px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer">Add Item</button>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredCoffees.map(c => (
                <motion.div key={c.id} layout className="group space-y-4">
                   <div onClick={() => onView(c)} className="aspect-[4/3] relative overflow-hidden bg-[var(--input-bg)] rounded-[5px] cursor-pointer border border-[var(--border-color)]">
                      <img src={c.image_url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" alt={c.name} />
                      <div className="absolute top-3 left-3 bg-[var(--bg-color)]/90 backdrop-blur-md px-2.5 py-1 rounded-[5px] text-[7px] font-black uppercase tracking-widest text-indigo-500">{c.roast_level}</div>
                   </div>
                   <div className="space-y-3">
                      <div onClick={() => onView(c)} className="cursor-pointer space-y-1">
                         <h4 className="text-base font-black uppercase transition-colors group-hover:text-indigo-500 tracking-tight">{c.name}</h4>
                         <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2"><MapPin className="w-3 h-3" /> {c.origin}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3">
                         <p className="text-sm font-serif italic text-indigo-500 tracking-tighter">${c.price.toFixed(2)}</p>
                         <div className="flex gap-1.5 grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                            <button onClick={() => onEdit(c)} className="w-7 h-7 rounded-[5px] border border-[var(--border-color)] flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all cursor-pointer"><Edit3 className="w-3 h-3" /></button>
                            <button onClick={() => onDelete(c.id)} className="w-7 h-7 rounded-[5px] border border-[var(--border-color)] flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-all cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
         )}
      </section>
    </motion.div>
  );
}
