import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Coffee, Loader2, Sparkles, MapPin, X, ShoppingBag, BarChart3, TrendingUp, CreditCard, ChevronLeft, ChevronRight, PackageCheck, Edit3, Save, Search, Settings, AlertCircle, ChevronDown, Filter, Moon, Sun, Lock, User, LogOut, KeyRound, Fingerprint, ShieldAlert, ShieldCheck, Calendar, Info, ArrowDown, ArrowLeft, Database, HardDrive, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type CoffeeItem, type UserProfile } from "./lib/api.js";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("studio_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeView, setActiveView] = useState<"discovery" | "persona">("discovery");
  const [settingsTab, setSettingsTab] = useState<"identity" | "security" | "archival">("identity");
  
  const [viewingItem, setViewingItem] = useState<CoffeeItem | null>(null);
  const [coffees, setCoffees] = useState<CoffeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CoffeeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const [theme, setTheme] = useState<"light" | "dark">(localStorage.getItem("inventory_theme") as any || "light");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoast, setSelectedRoast] = useState("All Roasts");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [origin, setOrigin] = useState("");
  const [roast, setRoast] = useState("Medium");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    localStorage.setItem("inventory_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchInitialCoffees();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError(null); setIsSubmitting(true);
    try {
      if (authMode === "login") {
        const result = await api.login(authEmail, authPassword);
        setUser(result);
        localStorage.setItem("studio_user", JSON.stringify(result));
        setIsAuthModalOpen(false);
        showNotification("Logged In");
      } else {
        const result = await api.register(authName, authEmail, authPassword);
        setUser(result);
        localStorage.setItem("studio_user", JSON.stringify(result));
        setIsAuthModalOpen(false);
        showNotification("Registered Successfully");
      }
    } catch (err: any) {
      if (err.message === "NoSuchCurator") setAuthError("Email not found");
      else if (err.message === "InvalidSecurityKey") setAuthError("Incorrect password");
      else if (err.message === "Email already archived") setAuthError("Email already in use");
      else setAuthError("Authentication failed");
    } finally { setIsSubmitting(false); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setProfileError(null); setIsSubmitting(true);
    if (!user) return;
    if (newPassword && newPassword !== confirmNewPassword) { setProfileError("Passwords do not match"); setIsSubmitting(false); return; }
    try {
      const result = await api.updateProfile(user.email, oldPassword, newPassword, newName);
      const updatedUser = { ...user, name: result.name };
      setUser(updatedUser);
      localStorage.setItem("studio_user", JSON.stringify(updatedUser));
      setOldPassword(""); setNewPassword(""); setConfirmNewPassword(""); 
      showNotification("Profile Updated");
    } catch (err: any) {
      if (err.message === "InvalidSecurityKey") setProfileError("Incorrect current password");
      else setProfileError("Update failed");
    } finally { setIsSubmitting(false); }
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem("studio_user"); setActiveView("discovery"); showNotification("Logged Out"); };

  const fetchInitialCoffees = async () => {
    setLoading(true);
    try {
      const data = await api.fetchCoffees(200, 0); 
      setCoffees(Array.isArray(data) ? data : []); 
    } catch (err: any) {
      setCoffees([]);
    } finally { setLoading(false); }
  };

  const startEdit = (coffee: CoffeeItem) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setEditingItem(coffee);
    setName(coffee.name || ""); setBrand(coffee.brand || ""); setOrigin(coffee.origin || ""); setRoast(coffee.roast_level || "Medium"); setPrice(coffee.price?.toString() || ""); setNotes(coffee.notes || ""); setImageUrl(coffee.image_url || "");
    setIsFormOpen(true);
  };

  const startAdd = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    resetForm(); setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setDeleteConfirmId(id);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(null); setIsSubmitting(true);
    const data = { 
      name: name.trim(), brand: brand.trim(), origin: origin.trim(), 
      roast_level: roast, price: parseFloat(price) || 0, 
      notes: notes.trim(), image_url: imageUrl.trim() || "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800", 
      roast_date: new Date().toISOString() 
    };
    if (!data.name) { setFormError("Name is required"); setIsSubmitting(false); return; }
    try {
      if (editingItem) {
        await api.updateCoffee(editingItem.id, data);
        showNotification("Item Updated");
      } else {
        await api.addCoffee(data);
        showNotification("Item Added");
      }
      resetForm();
      setSearchQuery("");
      setSelectedRoast("All Roasts");
      await fetchInitialCoffees();
    } catch (err: any) { setFormError("Update failed"); } finally { setIsSubmitting(false); }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.deleteCoffee(deleteConfirmId);
      setDeleteConfirmId(null);
      await fetchInitialCoffees();
      showNotification("Item Deleted");
    } catch (err) { showNotification("Delete failed", "error"); }
  };

  const resetForm = () => { setName(""); setBrand(""); setOrigin(""); setRoast("Medium"); setPrice(""); setNotes(""); setImageUrl(""); setEditingItem(null); setIsFormOpen(false); setFormError(null); };

  const filteredCoffees = useMemo(() => {
    const list = Array.isArray(coffees) ? coffees : [];
    return [...list].sort((a, b) => Number(b.id) - Number(a.id)).filter(c => {
      const q = searchQuery.toLowerCase();
      const n = (c.name || "").toLowerCase();
      const o = (c.origin || "").toLowerCase();
      const b = (c.brand || "").toLowerCase();
      const nameMatch = n.includes(q);
      const originMatch = o.includes(q);
      const brandMatch = b.includes(q);
      const roastMatch = selectedRoast === "All Roasts" || c.roast_level === selectedRoast;
      return (nameMatch || originMatch || brandMatch) && roastMatch;
    });
  }, [coffees, searchQuery, selectedRoast]);

  const deleteTarget = useMemo(() => coffees.find(c => c.id === deleteConfirmId), [coffees, deleteConfirmId]);

  const STYLES = {
    input: "w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[5px] py-1.5 px-3 sm:py-2 px-5 font-black text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase outline-none focus:border-indigo-500 transition-all",
    button: "w-full bg-indigo-500 hover:bg-black text-white py-1.5 px-3 sm:py-2 px-5 rounded-[5px] font-black text-[8.5px] sm:text-[9px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95",
    label: "text-[7.5px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]"
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans selection:bg-indigo-500/30">
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[var(--bg-color)]/60 backdrop-blur-2xl px-6 sm:px-10 py-4 flex items-center justify-between border-b border-[var(--border-color)]">
         <div onClick={() => setActiveView("discovery")} className="flex items-center gap-6 cursor-pointer group">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-[5px] animate-pulse" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">Noir Roastery</p>
         </div>
         <div className="flex items-center gap-6">
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="text-[var(--text-secondary)] hover:text-indigo-500 transition-colors">
               {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <div className="w-px h-3 bg-[var(--border-color)]" />
            {user ? (
              <div className="flex items-center gap-4">
                 <button onClick={() => { setActiveView("persona"); setNewName(user.name); }} className="text-[8px] font-black uppercase tracking-widest text-indigo-500 hover:text-black dark:hover:text-white transition-all flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {user.name || "User"}
                 </button>
                 <button onClick={handleLogout} className="text-red-400 hover:text-red-500 p-1 transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode("login"); setIsAuthModalOpen(true); }} className="text-[8px] font-black uppercase tracking-widest text-indigo-500 transition-all">Sign In</button>
            )}
         </div>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          {activeView === "discovery" ? (
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
                            <button key={r} onClick={() => setSelectedRoast(r)} className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-[5px] transition-all whitespace-nowrap ${selectedRoast === r ? "bg-indigo-500 text-white" : "text-[var(--text-secondary)] hover:text-indigo-500"}`}>{r}</button>
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
                      <button onClick={startAdd} className="bg-indigo-500 hover:bg-black text-white px-8 py-3 rounded-[5px] text-[8px] font-black uppercase tracking-[0.3em] transition-all">Add Item</button>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                      {filteredCoffees.map(c => (
                        <motion.div key={c.id} layout className="group space-y-4">
                           <div onClick={() => setViewingItem(c)} className="aspect-[4/3] relative overflow-hidden bg-[var(--input-bg)] rounded-[5px] cursor-pointer border border-[var(--border-color)]">
                              <img src={c.image_url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                              <div className="absolute top-3 left-3 bg-[var(--bg-color)]/90 backdrop-blur-md px-2.5 py-1 rounded-[5px] text-[7px] font-black uppercase tracking-widest text-indigo-500">{c.roast_level}</div>
                           </div>
                           <div className="space-y-3">
                              <div onClick={() => setViewingItem(c)} className="cursor-pointer space-y-1">
                                 <h4 className="text-base font-black uppercase transition-colors group-hover:text-indigo-500 tracking-tight">{c.name}</h4>
                                 <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2"><MapPin className="w-3 h-3" /> {c.origin}</p>
                              </div>
                              <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3">
                                 <p className="text-sm font-serif italic text-indigo-500 tracking-tighter">${c.price.toFixed(2)}</p>
                                 <div className="flex gap-1.5 grayscale opacity-20 group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                                    <button onClick={() => startEdit(c)} className="w-7 h-7 rounded-[5px] border border-[var(--border-color)] flex items-center justify-center hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all"><Edit3 className="w-3 h-3" /></button>
                                    <button onClick={() => handleDelete(c.id)} className="w-7 h-7 rounded-[5px] border border-[var(--border-color)] flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"><Trash2 className="w-3 h-3" /></button>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                 )}
              </section>
            </motion.div>
          ) : (
            <motion.div key="persona" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 pb-32 px-4 sm:px-10">
               <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 sm:gap-14">
                  <aside className="w-full md:w-52 shrink-0 space-y-8">
                     <div className="space-y-6 px-1 sm:px-0">
                        <button onClick={() => setActiveView("discovery")} className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-indigo-500 hover:text-black dark:hover:text-white transition-all group">
                           <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                           Discovery
                        </button>
                        <div className="space-y-1">
                           <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none">Settings.</h2>
                           <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-500">Preferences</p>
                        </div>
                     </div>
                     <div className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-visible p-1 md:p-0">
                        {[{ id: "identity", label: "Profile", icon: User }, { id: "security", label: "Security", icon: KeyRound }, { id: "archival", label: "Account", icon: Database }].map(tab => (
                          <button key={tab.id} onClick={() => setSettingsTab(tab.id as any)} className={`flex items-center gap-3 px-5 py-3 rounded-[5px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${settingsTab === tab.id ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/10" : "text-[var(--text-secondary)] hover:bg-[var(--input-bg)] hover:text-indigo-500"}`}>
                             <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                          </button>
                        ))}
                     </div>
                  </aside>

                  <div className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[5px] p-6 sm:p-10 shadow-sm">
                     <AnimatePresence mode="wait">
                        {settingsTab === "identity" && (
                          <motion.div key="identity" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-8">
                             <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-color)]">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-[5px] text-white flex items-center justify-center"><User className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                                <div className="space-y-0.5">
                                   <p className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none">{user?.name}</p>
                                   <p className="text-[7.5px] sm:text-[8px] font-bold uppercase tracking-widest text-indigo-500">{user?.email}</p>
                                </div>
                             </div>
                             <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                   <label className={STYLES.label}>Name</label>
                                   <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className={STYLES.input} />
                                </div>
                                <div className="pt-4 flex justify-end">
                                   <button type="submit" disabled={isSubmitting} className={`${STYLES.button} sm:w-auto px-8 sm:px-12`}>
                                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                      Update
                                   </button>
                                </div>
                             </form>
                          </motion.div>
                        )}

                        {settingsTab === "security" && (
                          <motion.div key="security" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-8">
                             <div className="space-y-1 pb-6 border-b border-[var(--border-color)]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Security Settings</h3>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50">Manage Identity</p>
                             </div>
                             {profileError && <p className="text-red-500 text-[8px] font-black uppercase tracking-widest text-center bg-red-500/5 py-2.5 rounded-[5px] border border-red-500/10 shadow-md">{profileError}</p>}
                             <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <label className={STYLES.label}>New Password</label>
                                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={STYLES.input} />
                                   </div>
                                   <div className="space-y-2">
                                      <label className={STYLES.label}>Confirm Password</label>
                                      <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className={STYLES.input} />
                                   </div>
                                </div>
                                <div className="pt-6 border-t border-[var(--border-color)] space-y-2">
                                   <label className={`${STYLES.label} text-red-500`}>Current Password *</label>
                                   <input required type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className={`${STYLES.input} bg-red-500/5 border-red-500/20 focus:border-red-500`} />
                                </div>
                                <div className="pt-4">
                                   <button type="submit" disabled={isSubmitting} className={STYLES.button}>
                                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                      Update Password
                                   </button>
                                </div>
                             </form>
                          </motion.div>
                        )}

                        {settingsTab === "archival" && (
                          <motion.div key="archival" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="space-y-8">
                             <div className="space-y-1 pb-6 border-b border-[var(--border-color)]">
                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Account Management</h3>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-50">Session Management</p>
                             </div>
                             <div className="space-y-4">
                                <div className="p-5 sm:p-6 border border-[var(--border-color)] rounded-[5px] bg-[var(--input-bg)]/30 space-y-4">
                                   <div className="space-y-1">
                                      <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Logout</h4>
                                      <p className="text-[8px] font-medium tracking-widest text-[var(--text-secondary)] italic opacity-60 leading-relaxed">End your current session.</p>
                                   </div>
                                   <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-2 sm:px-8 sm:py-2.5 bg-red-500/5 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-500 rounded-[5px] text-[8px] font-black uppercase tracking-[0.3em] transition-all">
                                      <LogOut className="w-3.5 h-3.5" /> Logout
                                   </button>
                                </div>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* COMPACT CURATOR FAB */}
      {activeView === "discovery" && (
        <motion.button initial={{ scale: 0, y: 40 }} animate={{ scale: 1, y: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={startAdd} className="fixed bottom-10 right-10 z-[200] w-10 h-10 bg-indigo-500 text-white rounded-[5px] shadow-2xl flex items-center justify-center hover:bg-black transition-all group">
           <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </motion.button>
      )}

      {/* COMPACT AUTH MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 15 }} className="w-full max-w-sm bg-[var(--bg-color)] border border-[var(--border-color)] p-8 rounded-[5px] shadow-2xl relative space-y-8">
                <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-5 right-5 z-10 w-6 h-6 bg-red-500 text-white rounded-[5px] flex items-center justify-center hover:bg-red-600 transition-colors"><X className="w-3 h-3" /></button>
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

      {/* BALANCED BOX-STYLE CURATION MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }} className="bg-[var(--bg-color)] border border-[var(--border-color)] w-full max-w-xl relative shadow-2xl rounded-[5px] overflow-hidden">
                <div className="px-6 py-4 sm:px-8 sm:py-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--input-bg)]/30">
                   <div className="space-y-0.5">
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{editingItem ? "Update Item" : "Add Item"}</h3>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-500">Inventory Registry</p>
                   </div>
                   <button onClick={resetForm} className="w-7 h-7 bg-red-500 text-white rounded-[5px] flex items-center justify-center hover:bg-red-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 max-h-[85vh] min-h-[520px] overflow-y-auto no-scrollbar flex flex-col justify-between">
                   {formError && <p className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center">{formError}</p>}
                   <form onSubmit={handleSave} className="space-y-6 sm:space-y-8 flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                         <div className="space-y-2">
                            <label className={STYLES.label}>Name</label>
                            <input required value={name} onChange={e => setName(e.target.value)} className={STYLES.input} />
                         </div>
                         <div className="space-y-2">
                            <label className={STYLES.label}>Origin</label>
                            <input required value={origin} onChange={e => setOrigin(e.target.value)} className={STYLES.input} />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                         <div className="space-y-2">
                            <label className={STYLES.label}>Price (USD)</label>
                            <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className={STYLES.input} />
                         </div>
                         <div className="space-y-2">
                            <label className={STYLES.label}>Roast Level</label>
                            <div className="grid grid-cols-3 gap-2 h-[34px] sm:h-[38px]">
                               {["Light", "Medium", "Dark"].map(r => (
                                 <button type="button" key={r} onClick={() => setRoast(r)} className={`flex items-center justify-center rounded-[5px] text-[8px] font-black uppercase border transition-all ${roast === r ? "bg-indigo-500 text-white border-indigo-500" : "bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-indigo-500/30"}`}>{r}</button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className={STYLES.label}>Image URL</label>
                         <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className={STYLES.input} />
                      </div>

                      <div className="space-y-2">
                         <label className={STYLES.label}>Notes</label>
                         <textarea value={notes} onChange={e => setNotes(e.target.value)} className={`${STYLES.input} h-20 sm:h-24 py-3 sm:py-4 normal-case font-medium`} />
                      </div>

                      <div className="flex gap-4 pt-6 sm:pt-8 border-t border-[var(--border-color)] mt-auto">
                         <button type="submit" disabled={isSubmitting} className={`${STYLES.button}`}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {editingItem ? "Update" : "Add"}
                         </button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{viewingItem && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingItem(null)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-[var(--bg-color)] border border-[var(--border-color)] w-full max-w-3xl relative rounded-[5px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[80vh]">
                <button onClick={() => setViewingItem(null)} className="absolute top-4 right-4 z-20 w-6 h-6 bg-red-500 text-white rounded-[5px] flex items-center justify-center hover:bg-red-600 transition-colors"><X className="w-3 h-3" /></button>
                <div className="w-full md:w-[35%] shrink-0 h-44 md:h-auto bg-black"><img src={viewingItem.image_url} className="w-full h-full object-cover opacity-60 grayscale" /></div>
                <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center space-y-8 overflow-y-auto no-scrollbar">
                   <div className="space-y-4">
                      <div className="flex gap-2 flex-wrap"><span className="px-3 py-1 bg-indigo-500 text-white text-[7.5px] font-black uppercase tracking-widest rounded-[5px]">{viewingItem.roast_level}</span><span className="px-3 py-1 bg-[var(--input-bg)] border border-[var(--border-color)] text-[7.5px] font-black uppercase tracking-widest rounded-[5px]">{viewingItem.origin}</span></div>
                      <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none">{viewingItem.name}</h2>
                      <p className="text-xl font-serif italic text-indigo-500">${viewingItem.price.toFixed(2)}</p>
                   </div>
                   <div className="space-y-2"><p className="text-[7.5px] font-black uppercase tracking-[0.4em] text-indigo-500 border-b border-[var(--border-color)] pb-2">Notes</p><p className="text-sm italic font-serif leading-relaxed">"{viewingItem.notes || "No sensory notes specified."}"</p></div>
                   <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto"><div className="space-y-0.5"><p className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Date Added</p><p className="text-[9px] font-black">{new Date(viewingItem.roast_date).toLocaleDateString()}</p></div><button onClick={() => { setViewingItem(null); startEdit(viewingItem); }} className={`${STYLES.button} sm:w-auto px-8`}>Update Item</button></div>
                </div>
             </motion.div>
          </div>
      )}</AnimatePresence>

      <AnimatePresence>{deleteConfirmId && (<div className="fixed inset-0 z-[800] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" /><motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--bg-color)] border border(--border-color)] w-full max-w-xs relative p-8 text-center rounded-[5px] shadow-2xl"><h3 className="text-xl font-black uppercase tracking-tighter mb-2 leading-none">Delete?</h3><p className="text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-8 italic">"{deleteTarget?.name}"</p><div className="flex flex-col gap-2"><button onClick={confirmDelete} className={STYLES.button + " bg-red-500 shadow-red-500/10"}>Delete</button><button onClick={() => setDeleteConfirmId(null)} className="w-full text-slate-300 text-[8px] font-black uppercase tracking-widest py-2">Cancel</button></div></motion.div></div>)}</AnimatePresence>
      <AnimatePresence>{notification && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[900] px-8 py-4 bg-indigo-500 text-white rounded-[5px] shadow-2xl text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">{notification.message}</motion.div>)}</AnimatePresence>
    </div>
  );
}
