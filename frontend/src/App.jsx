import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import PetShop from './pages/PetShop';
import GalleryPage from './pages/GalleryPage';
import Appointments from './pages/Appointments';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminProducts from './pages/admin/Products';
import AdminGallery from './pages/admin/Gallery';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminFaqs from './pages/admin/Faqs';
import AdminAbout from './pages/admin/About';
import AdminHomepage from './pages/admin/Homepage';
import AdminContactSettings from './pages/admin/ContactSettings';
import AdminBusinessHours from './pages/admin/BusinessHours';
import AdminAppointmentSettings from './pages/admin/AppointmentSettings';
import AdminSeoSettings from './pages/admin/SeoSettings';
import AdminProfile from './pages/admin/Profile';

function PublicLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/services/:slug" element={<PublicLayout><ServiceDetails /></PublicLayout>} />
      <Route path="/pet-shop" element={<PublicLayout><PetShop /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
      <Route path="/appointments" element={<PublicLayout><Appointments /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faqs" element={<AdminFaqs />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="contact-settings" element={<AdminContactSettings />} />
        <Route path="business-hours" element={<AdminBusinessHours />} />
        <Route path="appointment-settings" element={<AdminAppointmentSettings />} />
        <Route path="seo-settings" element={<AdminSeoSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
