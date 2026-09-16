import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock3, CheckCircle2, XCircle, CalendarDays, TrendingUp, Stethoscope, ShoppingBag, Image, Star } from 'lucide-react';
import { AdminPageHeader, StatCard } from '../../components/admin/AdminUI';
import { Loader } from '../../components/States';
import { appointmentApi, serviceApi, productApi, galleryApi, testimonialApi } from '../../api/services';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [counts, setCounts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentApi.getDashboardStats(),
      serviceApi.getAll({ all: true }),
      productApi.getAll({ all: true }),
      galleryApi.getAll(),
      testimonialApi.getAll({ all: true }),
      appointmentApi.getAll({ limit: 6 }),
    ])
      .then(([s, sv, p, g, t, appts]) => {
        setStats(s.data.stats);
        setCounts({ services: sv.data.services.length, products: p.data.products.length, gallery: g.data.images.length, testimonials: t.data.testimonials.length });
        setRecent(appts.data.appointments);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="An overview of Lil Paws bookings and content." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Appointments" value={stats.today} icon={CalendarDays} accent />
        <StatCard label="Pending" value={stats.pending} icon={Clock3} />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle2} />
        <StatCard label="Upcoming" value={stats.upcoming} icon={TrendingUp} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={stats.cancelled} icon={XCircle} />
        <StatCard label="No-shows" value={stats.noShow} icon={XCircle} />
        <StatCard label="Total Appointments" value={stats.total} icon={CalendarClock} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard label="Services" value={counts.services} icon={Stethoscope} />
        <StatCard label="Products" value={counts.products} icon={ShoppingBag} />
        <StatCard label="Gallery Images" value={counts.gallery} icon={Image} />
        <StatCard label="Testimonials" value={counts.testimonials} icon={Star} />
      </div>

      <div className="bg-white border border-ink/8 rounded-2xl mt-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8">
          <h3 className="font-display font-semibold text-ink">Recent Appointments</h3>
          <Link to="/admin/appointments" className="text-sm font-semibold text-paw-600 hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-ink/50 p-6">No appointments yet.</p>
        ) : (
          <div className="divide-y divide-ink/6">
            {recent.map((a) => (
              <div key={a._id} className="flex items-center justify-between px-6 py-3.5 text-sm">
                <div>
                  <p className="font-semibold text-ink">{a.ownerName} — {a.petName}</p>
                  <p className="text-ink/50 text-xs mt-0.5">{a.serviceName} · {a.date} · {a.timeSlot}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ink/5 text-ink/60 capitalize">{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
