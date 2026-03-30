import React from "react";
import { X, Fingerprint, Loader2, ShieldCheck, Save, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CoffeeItem } from "../lib/api.js";

interface ModalsProps {
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (o: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (m: "login" | "register") => void;
  authError: string | null;
  setAuthError: (e: string | null) => void;
  handleAuth: (e: React.FormEvent) => void;
  authName: string;
  setAuthName: (n: string) => void;
  authEmail: string;
  setAuthEmail: (e: string) => void;
  authPassword: string;
  setAuthPassword: (p: string) => void;
  
  isFormOpen: boolean;
  setIsFormOpen: (o: boolean) => void;
  editingItem: CoffeeItem | null;
  resetForm: () => void;
  handleSave: (e: React.FormEvent) => void;
  formError: string | null;
  name: string;
  setName: (n: string) => void;
  brand: string;
  setBrand: (b: string) => void;
  origin: string;
  setOrigin: (o: string) => void;
  price: string;
  setPrice: (p: string) => void;
  roast: string;
  setRoast: (r: string) => void;
  imageUrl: string;
  setImageUrl: (u: string) => void;
  notes: string;
  setNotes: (n: string) => void;

  viewingItem: CoffeeItem | null;
  setViewingItem: (i: CoffeeItem | null) => void;
  startEdit: (c: CoffeeItem) => void;

  deleteConfirmId: number | null;
  setDeleteConfirmId: (id: number | null) => void;
  deleteTarget: CoffeeItem | undefined;
  confirmDelete: () => void;

  isSubmitting: boolean;
  STYLES: any;
}

export default function Modals(props: ModalsProps) {
  const {
    isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, authError, setAuthError, handleAuth, authName, setAuthName, authEmail, setAuthEmail, authPassword, setAuthPassword,
    isFormOpen, setIsFormOpen, editingItem, resetForm, handleSave, formError, name, setName, brand, setBrand, origin, setOrigin, price, setPrice, roast, setRoast, imageUrl, setImageUrl, notes, setNotes,
    viewingItem, setViewingItem, startEdit,
    deleteConfirmId, setDeleteConfirmId, deleteTarget, confirmDelete,
    isSubmitting, STYLES
  } = props;

  return (
    <>
      {/* AUTH MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
             <motion.div initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 15 }} className="w-full max-w-sm bg-[var(--bg-color)] border border-[var(--border-color)] p-8 rounded-[5px] shadow-2xl relative space-y-6 h-fit">
                <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-5 right-5 z-10 w-6 h-6 bg-red-500 text-white rounded-[5px] flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                <div className="text-center space-y-2">
                   <Fingerprint className="w-8 h-8 text-indigo-500 mx-auto" />
                   <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{authMode}</h3>
                   <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Identity Authentication</p>
                </div>
                {authError && <p className="text-red-500 text-[8px] font-black uppercase text-center bg-red-500/5 py-2 rounded-[5px]">{authError}</p>}
                <form onSubmit={handleAuth} className="space-y-3">
                   {authMode === "register" ? (
                     <>
                       <input required placeholder="Name" value={authName} onChange={e => setAuthName(e.target.value)} className={`${STYLES.input} text-center`} />
                       <input required type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className={`${STYLES.input} text-center`} />
                       <input required type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className={`${STYLES.input} text-center`} />
                     </>
                   ) : (
                     <>
                       <input required type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className={`${STYLES.input} text-center`} />
                       <input required type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} className={`${STYLES.input} text-center`} />
                     </>
                   )}
                   <div className="pt-2">
                     <button type="submit" disabled={isSubmitting} className={STYLES.button}>
                        {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        {authMode === "login" ? "Login" : "Register"}
                     </button>
                   </div>
                </form>
                <div className="text-center pt-2">
                   <button onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(null); }} className="text-[7.5px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-indigo-500 transition-colors underline underline-offset-4 decoration-indigo-500/20">
                      {authMode === "login" ? "Create Account" : "Sign In"}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CURATION MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.98, y: 20 }} 
                className="bg-[var(--bg-color)] border border-[var(--border-color)] w-full max-w-xl h-auto max-h-[90vh] relative shadow-2xl rounded-[5px] overflow-hidden flex flex-col"
              >
                 <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--input-bg)]/30 shrink-0">
                    <div className="space-y-0.5">
                       <h3 className="text-xl font-black uppercase tracking-tight">{editingItem ? "Update Item" : "Add Item"}</h3>
                       <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-500">Inventory Registry</p>
                    </div>
                    <button onClick={resetForm} className="w-7 h-7 bg-red-500 text-white rounded-[5px] flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                 </div>
                 <div className="p-4 sm:p-6 space-y-4 overflow-y-auto no-scrollbar">
                    {formError && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center">{formError}</p>}
                    <form onSubmit={handleSave} className="space-y-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className={STYLES.label}>Name</label>
                             <input required value={name} onChange={e => setName(e.target.value)} className={STYLES.input} />
                          </div>
                          <div className="space-y-1.5">
                             <label className={STYLES.label}>Brand (Opt.)</label>
                             <input placeholder="eg. Noir Origin" value={brand} onChange={e => setBrand(e.target.value)} className={STYLES.input} />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className={STYLES.label}>Origin</label>
                             <input required value={origin} onChange={e => setOrigin(e.target.value)} className={STYLES.input} />
                          </div>
                          <div className="space-y-1.5">
                             <label className={STYLES.label}>Price (USD)</label>
                             <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className={STYLES.input} />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className={STYLES.label}>Roast Level</label>
                             <div className="grid grid-cols-3 gap-2 h-[34px]">
                                {["Light", "Medium", "Dark"].map(r => (
                                  <button type="button" key={r} onClick={() => setRoast(r)} className={`flex items-center justify-center rounded-[5px] text-[8px] font-black uppercase border transition-all ${roast === r ? "bg-indigo-500 text-white border-indigo-500" : "bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-indigo-500/30"}`}>{r}</button>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-1.5">
                             <label className={STYLES.label}>Image URL</label>
                             <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={STYLES.input} />
                          </div>
                       </div>

                       <div className="space-y-1.5">
                          <label className={STYLES.label}>Notes</label>
                          <textarea value={notes} onChange={e => setNotes(e.target.value)} className={`${STYLES.input} h-16 py-2 normal-case font-medium`} />
                       </div>

                       <div className="flex gap-4 pt-4 border-t border-[var(--border-color)]">
                          <button type="submit" disabled={isSubmitting} className={`${STYLES.button} py-2.5`}>
                             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                             {editingItem ? "Update Item" : "Add to Registry"}
                          </button>
                       </div>
                    </form>
                 </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {viewingItem && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 sm:p-10">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingItem(null)} className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-[var(--bg-color)] border border-[var(--border-color)] w-full max-w-3xl relative rounded-[5px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[80vh]">
                <button onClick={() => setViewingItem(null)} className="absolute top-4 right-4 z-20 w-6 h-6 bg-red-500 text-white rounded-[5px] flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                <div className="w-full md:w-[35%] shrink-0 h-44 md:h-auto bg-black"><img src={viewingItem.image_url} className="w-full h-full object-cover opacity-60 grayscale" alt={viewingItem.name} /></div>
                <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center space-y-8 overflow-y-auto no-scrollbar">
                   <div className="space-y-4">
                      <div className="flex gap-2 flex-wrap"><span className="px-3 py-1 bg-indigo-500 text-white text-[7.5px] font-black uppercase tracking-widest rounded-[5px]">{viewingItem.roast_level}</span><span className="px-3 py-1 bg-[var(--input-bg)] border border-[var(--border-color)] text-[7.5px] font-black uppercase tracking-widest rounded-[5px]">{viewingItem.origin}</span></div>
                      <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none">
                          <span className="text-indigo-500 block text-[9px] mb-2 tracking-[0.4em]">{viewingItem.brand || "Specialty Batch"}</span>
                          {viewingItem.name}
                       </h2>
                      <p className="text-xl font-serif italic text-indigo-500">${viewingItem.price.toFixed(2)}</p>
                   </div>
                   <div className="space-y-2"><p className="text-[7.5px] font-black uppercase tracking-[0.4em] text-indigo-500 border-b border-[var(--border-color)] pb-2">Notes</p><p className="text-sm italic font-serif leading-relaxed">"{viewingItem.notes || "No sensory notes specified."}"</p></div>
                   <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto"><div className="space-y-0.5"><p className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Date Added</p><p className="text-[9px] font-black">{new Date(viewingItem.roast_date).toLocaleDateString()}</p></div><button onClick={() => { setViewingItem(null); startEdit(viewingItem); }} className={`${STYLES.button} sm:w-auto px-8`}>Update Item</button></div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-color)] border border-[var(--border-color)] w-full max-w-xs relative p-8 text-center rounded-[5px] shadow-2xl">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 leading-none">Delete?</h3>
                <p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-8 italic">"{deleteTarget?.name}"</p>
                <div className="flex flex-col gap-2">
                   <button onClick={confirmDelete} className={STYLES.button + " bg-red-500 shadow-red-500/10 cursor-pointer"}>Delete</button>
                   <button onClick={() => setDeleteConfirmId(null)} className="w-full text-slate-300 text-[8px] font-black uppercase tracking-widest py-2 cursor-pointer">Cancel</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
