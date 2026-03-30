import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex flex-col justify-center px-6 sm:px-10 overflow-hidden border-b border-[var(--border-color)]/20 bg-[var(--bg-color)]">
      {/* 🍱 HIGH-FIDELITY NOIR MARQUEE */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] overflow-hidden whitespace-nowrap">
        <motion.h2 
          animate={{ x: [0, -1200] }} 
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="text-[35rem] font-black uppercase tracking-tighter"
        >
          NOIR ROASTERY NOIR ROASTERY NOIR ROASTERY
        </motion.h2>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 text-center sm:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-[1.5px] bg-indigo-500"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.8em] text-indigo-500">Established 2026</p>
          </div>
          
          <div className="relative">
             <h1 className="text-8xl sm:text-[15rem] font-black tracking-tight leading-[0.75] text-[var(--text-primary)] uppercase">
                Noir.
             </h1>
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: "100%" }} 
               transition={{ delay: 0.5, duration: 1 }}
               className="h-[2px] bg-gradient-to-r from-indigo-500 to-transparent mt-4 opacity-50"
             />
          </div>

          <div className="max-w-3xl space-y-4">
             <p className="text-base sm:text-3xl text-[var(--text-secondary)] italic font-serif leading-tight">
                Curating high-fidelity specialty batches for the modern connoisseur.
             </p>
             <div className="flex items-center gap-4 pt-4 text-[var(--text-secondary)] opacity-40">
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Batch Registry v.04</span>
                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">System Active</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none hidden sm:block">
         <div className="text-[12px] font-black uppercase tracking-[1em] rotate-90 origin-right">
            High Density / Noir Minimal
         </div>
      </div>
    </section>
  );
}
