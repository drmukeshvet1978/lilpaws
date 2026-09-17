import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarClock, Stethoscope, ShoppingBag, Image, Star, HelpCircle,
  UserSquare2, Home, PhoneCall, Clock, Settings2, Search, UserCircle, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/admin/services', label: 'Services', icon: Stethoscope },
  { to: '/admin/products', label: 'Products / Pet Shop', icon: ShoppingBag },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/about', label: 'About / Doctor', icon: UserSquare2 },
  { to: '/admin/homepage', label: 'Homepage', icon: Home },
  { to: '/admin/contact-settings', label: 'Contact Information', icon: PhoneCall },
  { to: '/admin/business-hours', label: 'Business Hours', icon: Clock },
  { to: '/admin/appointment-settings', label: 'Appointment Settings', icon: Settings2 },
  { to: '/admin/seo-settings', label: 'SEO Settings', icon: Search },
  { to: '/admin/profile', label: 'Admin Profile', icon: UserCircle },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-5 py-5">
        <img src={logo} alt="Lil Paws" className="h-9 object-contain" />
        <span className="font-display font-semibold text-cream text-sm">Admin Panel</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-paw-500 text-white' : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-cream/10">
        <div className="px-3 py-2 text-xs text-cream/40">Signed in as</div>
        <div className="px-3 pb-2 text-sm font-semibold text-cream truncate">{admin?.name}</div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cream/70 hover:bg-cream/10 hover:text-cream transition-colors">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Desktop sidebar — pinned to the viewport, only its own nav list scrolls internally */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-ink flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-ink/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 bg-ink flex items-center justify-between px-4 py-3">
          <img src={logo} alt="Lil Paws" className="h-8 object-contain" />
          <button onClick={() => setMobileOpen((o) => !o)} className="text-cream p-1.5">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>
        <main className="p-5 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}