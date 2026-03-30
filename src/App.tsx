import React, { useState, useEffect, useMemo } from "react";
import { Plus, Moon, Sun, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, type CoffeeItem, type UserProfile } from "./lib/api.js";

// Components
import Discovery from "./components/Discovery";
import Console from "./components/Console";
import Modals from "./components/Modals";
import Header from "./components/Header";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("studio_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeView, setActiveView] = useState<"discovery" | "persona">(() => {
    return (localStorage.getItem("studio_last_view") as any) || "discovery";
  });
  const [settingsTab, setSettingsTab] = useState<"identity" | "security" | "analytics" | "archival">(() => {
    return (localStorage.getItem("studio_last_tab") as any) || "identity";
  });
  const [analytics, setAnalytics] = useState<{ order_count: number; orders: any[] } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => localStorage.getItem("sidebarOpen") !== "false");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  const [viewingItem, setViewingItem] = useState<CoffeeItem | null>(null);
  const [coffees, setCoffees] = useState<CoffeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CoffeeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
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
  const [newName, setNewName] = useState(() => user?.name || "");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoast, setSelectedRoast] = useState("All Roasts");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [origin, setOrigin] = useState("");
  const [roast, setRoast] = useState("Medium");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const STYLES = {
    input: "w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-[5px] py-1.5 px-3 sm:py-2 px-5 font-black text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase outline-none focus:border-indigo-500 transition-all cursor-text",
    button: "w-full bg-indigo-500 hover:bg-black text-white py-1.5 px-3 sm:py-2 px-5 rounded-[5px] font-black text-[8.5px] sm:text-[9px] tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer",
    label: "text-[7.5px] font-black uppercase tracking-[0.25em] text-[var(--text-secondary)]"
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [isMobile, activeView]);

  useEffect(() => {
    localStorage.setItem("inventory_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (settingsTab === "analytics" && activeView === "persona") {
      fetchAnalytics();
    }
  }, [settingsTab, activeView]);

  useEffect(() => {
    localStorage.setItem("studio_last_view", activeView);
    localStorage.setItem("studio_last_tab", settingsTab);
  }, [activeView, settingsTab]);

  useEffect(() => {
    if (user && !newName) setNewName(user.name);
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const data = await api.fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics failure", err);
    }
  };

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
        setNewName(result.name); // Sync form
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
    e.preventDefault(); 
    if (!user) return;
    setProfileError(null); 
    
    // 🍱 Module-Aware Logic: High-Density Verification
    if (settingsTab === "identity") {
      if (!newName.trim()) return;
    } else if (settingsTab === "security") {
      // Validate that EVERY terminal in the security module is populated
      if (!oldPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) return;

      // Passkey Integrity
      if (newPassword.length < 6) {
        setProfileError("Minimum 6 characters required");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setProfileError("Passkeys do not match");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await api.updateProfile(user.email, oldPassword, newPassword, newName.trim());
      const updatedUser = { ...user, name: result.name };
      setUser(updatedUser);
      localStorage.setItem("studio_user", JSON.stringify(updatedUser));
      setOldPassword(""); setNewPassword(""); setConfirmNewPassword(""); 
      showNotification(settingsTab === "security" ? "Security Refined" : "Identity Parameters Updated");
    } catch (err: any) {
      if (err.message === "InvalidSecurityKey") setProfileError("Incorrect verification key");
      else setProfileError("System update failed");
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

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] font-sans selection:bg-indigo-500/30">
      <Header 
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        setTheme={setTheme}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        settingsTab={settingsTab}
        onAuth={() => { setAuthMode("login"); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        eventsLogged={analytics?.orders?.length}
      />

      <main>
        <AnimatePresence mode="wait">
          {activeView === "discovery" ? (
            <Discovery 
              loading={loading}
              filteredCoffees={filteredCoffees}
              selectedRoast={selectedRoast}
              setSelectedRoast={setSelectedRoast}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAdd={startAdd}
              onEdit={startEdit}
              onDelete={handleDelete}
              onView={setViewingItem}
            />
          ) : (
            <Console 
              user={user}
              theme={theme}
              setTheme={setTheme}
              coffees={coffees}
              analytics={analytics}
              settingsTab={settingsTab}
              setSettingsTab={setSettingsTab}
              handleLogout={handleLogout}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              onUpdateUser={setUser}
              showNotification={showNotification}
              isMobile={isMobile}
              setActiveView={setActiveView}
              handleUpdateProfile={handleUpdateProfile}
              newName={newName}
              setNewName={setNewName}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
              profileError={profileError}
              isSubmitting={isSubmitting}
              STYLES={STYLES}
            />
          )}
        </AnimatePresence>
        
        {/* NOTIFICATION TOAST */}
        <AnimatePresence>
           {notification && (
             <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-8 right-8 z-[1000] flex items-center gap-4 px-6 py-4 bg-indigo-600 border border-indigo-400/30 rounded-[5px] backdrop-blur-xl">
                <div className={`w-2.5 h-2.5 rounded-full ${notification.type === 'success' ? 'bg-white' : 'bg-red-400'}`} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{notification.message}</p>
             </motion.div>
           )}
        </AnimatePresence>
      </main>

      {/* FAB - Only in discovery */}
      {activeView === "discovery" && (
        <motion.button initial={{ scale: 0, y: 40 }} animate={{ scale: 1, y: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={startAdd} className="fixed bottom-10 right-10 z-[200] w-10 h-10 bg-indigo-500 text-white rounded-[5px] shadow-2xl flex items-center justify-center hover:bg-black transition-all group cursor-pointer">
           <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </motion.button>
      )}

      {/* MODALS */}
      <Modals 
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authError={authError}
        setAuthError={setAuthError}
        handleAuth={handleAuth}
        authName={authName}
        setAuthName={setAuthName}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        editingItem={editingItem}
        resetForm={resetForm}
        handleSave={handleSave}
        formError={formError}
        name={name}
        setName={setName}
        brand={brand}
        setBrand={setBrand}
        origin={origin}
        setOrigin={setOrigin}
        price={price}
        setPrice={setPrice}
        roast={roast}
        setRoast={setRoast}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        notes={notes}
        setNotes={setNotes}
        viewingItem={viewingItem}
        setViewingItem={setViewingItem}
        startEdit={startEdit}
        deleteConfirmId={deleteConfirmId}
        setDeleteConfirmId={setDeleteConfirmId}
        deleteTarget={deleteTarget}
        confirmDelete={confirmDelete}
        isSubmitting={isSubmitting}
        STYLES={STYLES}
      />
   </div>
  );
}
