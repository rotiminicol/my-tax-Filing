import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon, Settings, ChevronDown, Menu, Search, X, ArrowRight } from "lucide-react";
import Logo from "@/components/brand/Logo";
import SignOutConfirmModal from "@/components/auth/SignOutConfirmModal";
import { useAuth } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";
import { notify } from "@/components/Toaster";
import { megaMenuData } from "@/config/megaMenu";

const links = [
  { to: "/taxes", label: "Taxes" },
  { to: "/rent-receipt", label: "Rent Receipt" },
  { to: "/document-renewal", label: "Document Renewal" },
  { to: "/e-invoicing", label: "E-invoicing" },
  { to: "/contact", label: "Contact" },
] as const;

export default function AppNav() {
  const user = useAuth((s) => s.user);
  const logOut = useAuth((s) => s.logOut);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavWithLoader = (to: string) => {
    useLoadingStore.getState().showLoader("Opening Portal...");
    setTimeout(() => {
      navigate(to as string);
      useLoadingStore.getState().hideLoader();
    }, 600);
  };
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const searchItems = [
    { name: "File Online Taxes", category: "Taxes", path: "/taxes", hash: "online", desc: "Use step-by-step instructions to file your own taxes." },
    { name: "File with Tax Pro", category: "Taxes", path: "/taxes", hash: "pro", desc: "Get expert help from a tax professional." },
    { name: "Small Business Taxes", category: "Taxes", path: "/taxes", hash: "small-business", desc: "Tax solutions for self-employed and small businesses." },
    { name: "Generate Rent Receipt", category: "Rent Receipt", path: "/rent-receipt", hash: "", desc: "Generate compliant rent allowance receipts in minutes." },
    { name: "Document Renewal", category: "Document Renewal", path: "/document-renewal", hash: "", desc: "Renew your important documents and certificates." },
    { name: "E-invoicing", category: "E-invoicing", path: "/e-invoicing", hash: "", desc: "Create and manage electronic invoices." },
    { name: "Contact Support", category: "Contact", path: "/contact", hash: "", desc: "Get help and contact our support team." }
  ];

  const filteredSearchItems = searchQuery.trim() === "" 
    ? [] 
    : searchItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50 && !activeMenu) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, activeMenu]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logOut();
    notify.success("Signed out", "You've been logged out successfully.");
    navigate("/customer-dashboard/login");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <>
      <header 
        className={`sticky top-0 z-40 hidden md:block transition-transform duration-500 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        onMouseLeave={() => setActiveMenu(null)}
      >
      <div className="absolute inset-0 glass border-b -z-10" />

      <div className="w-full px-6 xl:px-12 h-24 flex items-center justify-between">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8 xl:gap-12">
          <Logo size={140} />
          
          <nav className="flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center h-24 text-sm font-black tracking-tight transition-colors border-b-4 ${activeMenu === l.to || location.pathname.startsWith(l.to) ? 'text-primary border-primary' : 'text-foreground border-transparent hover:text-primary hover:border-primary'}`}
                onMouseEnter={() => setActiveMenu(megaMenuData[l.to] ? l.to : null)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavWithLoader(user.role === "admin" ? "/admin" : "/customer-dashboard/receipts")}
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 cursor-pointer"
            >
              {user.role === "admin" ? "Admin Console" : "Go to Dashboard"}
            </button>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl bg-background border border-border shadow-sm hover:border-primary/30 transition-all group"
            >
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary text-primary-foreground text-[12px] font-black group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-foreground max-w-[100px] truncate leading-none mb-1">{user.fullName.split(" ")[0]}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Account</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors ml-1" />
            </button>
            {open && (
              <div className="absolute right-0 mt-3 w-64 rounded-3xl border bg-background shadow-2xl py-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-3 border-b mb-1">
                  <p className="text-sm font-black text-foreground truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="px-2">
                  <Link to="/customer-dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all">
                    <UserIcon className="h-4 w-4" /> Profile Details
                  </Link>
                  <Link to="/customer-dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all">
                    <Settings className="h-4 w-4" /> App Settings
                  </Link>
                  <button onClick={() => { setOpen(false); setShowLogoutConfirm(true); }} className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 rounded-xl transition-all mt-1 cursor-pointer">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button aria-label="Search" onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 text-sm font-black tracking-tight text-foreground hover:text-primary transition-colors hidden lg:flex">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
            <div className="h-6 w-px bg-border hidden lg:block" />
            <button 
              onClick={() => handleNavWithLoader("/customer-dashboard/login")}
              className="text-sm font-black tracking-tight text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => handleNavWithLoader("/customer-dashboard/signup")}
              className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Mega Menu Dropdown – unchanged */}
      {activeMenu && megaMenuData[activeMenu] && (
        <div 
          className="absolute top-full left-0 w-full bg-background border-b border-border shadow-2xl animate-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setActiveMenu(activeMenu)}
        >
          <div className="w-full px-6 xl:px-12 py-10 flex gap-12">
            <div className="flex-1 flex flex-wrap gap-x-12 gap-y-8">
              {megaMenuData[activeMenu].columns.map((col: any, i: number) => (
                <div key={i} className="flex flex-col gap-4 min-w-[200px]">
                  {col.title && (
                    <p className={`font-black text-foreground ${col.titleLarge ? 'text-2xl mb-2' : 'text-sm mb-1'}`}>
                      {col.title}
                    </p>
                  )}
                  {col.items.map((item: any, j: number) => (
                    <Link
                      key={j}
                      to={item.to}
                      className={`text-sm text-muted-foreground hover:text-primary hover:underline transition-colors ${item.bold ? 'font-bold text-foreground' : 'font-medium'}`}
                      onClick={() => setActiveMenu(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            {megaMenuData[activeMenu].cards && (
              <div className="w-[350px] xl:w-[400px] flex flex-col gap-4 border-l border-border pl-12 shrink-0">
                {megaMenuData[activeMenu].cards.map((card: any, i: number) => (
                  <Link 
                    key={i} 
                    to={card.to}
                    className={`block p-8 rounded-2xl transition-transform hover:scale-[1.02] shadow-sm ${card.bgClass}`}
                    onClick={() => setActiveMenu(null)}
                  >
                    <h3 className="text-xl font-black mb-2">{card.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">{card.description}</p>
                    {card.image && (
                       <img src={card.image} alt="" className="mt-6 rounded-xl w-full h-32 object-cover shadow-sm" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </header>

      {/* Search Overlay Modal – unchanged */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-200">
          <div className="w-full px-6 xl:px-12 h-24 flex items-center justify-between bg-white">
            <Logo size={72} />
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2 hover:bg-neutral-50 rounded-full transition-colors text-black"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 relative bg-white pb-24">
            <div className="relative w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-6 pr-24 rounded-2xl border border-neutral-200 bg-white text-xl font-medium focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all text-neutral-800 placeholder:text-neutral-400 shadow-sm"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <div className="h-6 w-px bg-neutral-200" />
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="grid place-items-center w-6 h-6 rounded-full bg-black text-white hover:opacity-85 transition-opacity"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {searchQuery.trim() !== "" && (
                <div className="absolute top-20 left-0 right-0 bg-white border border-neutral-200 rounded-2xl shadow-xl p-4 max-h-[300px] overflow-y-auto divide-y divide-neutral-100 z-50">
                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex justify-between items-center py-3.5 hover:bg-neutral-50 px-3 rounded-xl transition-all group"
                      >
                        <div className="space-y-0.5 text-left">
                          <span className="text-[9px] font-mono font-black text-amber-600 uppercase tracking-widest">{item.category}</span>
                          <h4 className="text-sm font-black text-black group-hover:text-amber-600 transition-colors">{item.name}</h4>
                          <p className="text-[10px] text-black/45 font-semibold leading-normal">{item.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-black/35 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-xs font-semibold text-black/40">No matching features or resources found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <SignOutConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}