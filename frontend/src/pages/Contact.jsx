import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Navigation, Clock } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { Loader } from '../components/States';
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal';
import { settingsApi, businessHoursApi } from '../api/services';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [hours, setHours] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([settingsApi.get(), businessHoursApi.get()])
      .then(([s, h]) => {
        setSettings(s.data.settings);
        setHours(h.data.hours);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section-pad"><Loader /></div>;

  const whatsappDigits = settings?.whatsapp?.replace(/[^0-9]/g, '');

  return (
    <section className="section-pad">
      <div className="container-lp">
        <SectionHeading eyebrow="Contact" title="Come say hello" align="center" />

        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          <Stagger className="space-y-4">
            <StaggerItem>
              <div className="bg-white border border-ink/8 rounded-2xl p-6 flex gap-4 items-start">
                <MapPin className="text-paw-500 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="font-semibold text-ink mb-1">Address</p>
                  <p className="text-sm text-ink/60">{settings?.address}</p>
                  {settings?.googleMapsDirectionsUrl && (
                    <a href={settings.googleMapsDirectionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-paw-600 mt-2 hover:underline">
                      <Navigation size={14} /> Get Directions
                    </a>
                  )}
                </div>
              </div>
            </StaggerItem>

            {settings?.phone && (
              <StaggerItem>
                <a href={`tel:${settings.phone}`} data-cursor="Call" className="bg-white border border-ink/8 rounded-2xl p-6 flex gap-4 items-start hover:border-paw-400 transition-colors block">
                  <Phone className="text-paw-500 shrink-0 mt-0.5" size={22} />
                  <div>
                    <p className="font-semibold text-ink mb-1">Phone</p>
                    <p className="text-sm text-ink/60">{settings.phone}</p>
                  </div>
                </a>
              </StaggerItem>
            )}

            {whatsappDigits && (
              <StaggerItem>
                <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer" data-cursor="Chat" className="bg-white border border-ink/8 rounded-2xl p-6 flex gap-4 items-start hover:border-paw-400 transition-colors block">
                  <MessageCircle className="text-paw-500 shrink-0 mt-0.5" size={22} />
                  <div>
                    <p className="font-semibold text-ink mb-1">WhatsApp</p>
                    <p className="text-sm text-ink/60">{settings.whatsapp}</p>
                  </div>
                </a>
              </StaggerItem>
            )}

            {settings?.email && (
              <StaggerItem>
                <a href={`mailto:${settings.email}`} className="bg-white border border-ink/8 rounded-2xl p-6 flex gap-4 items-start hover:border-paw-400 transition-colors block">
                  <Mail className="text-paw-500 shrink-0 mt-0.5" size={22} />
                  <div>
                    <p className="font-semibold text-ink mb-1">Email</p>
                    <p className="text-sm text-ink/60">{settings.email}</p>
                  </div>
                </a>
              </StaggerItem>
            )}

            {hours?.weeklySchedule && (
              <StaggerItem>
                <div className="bg-white border border-ink/8 rounded-2xl p-6">
                  <div className="flex gap-4 items-start mb-3">
                    <Clock className="text-paw-500 shrink-0 mt-0.5" size={22} />
                    <p className="font-semibold text-ink">Opening Hours</p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {hours.weeklySchedule.map((d) => (
                      <div key={d.day} className="flex justify-between text-ink/60">
                        <span>{d.day}</span>
                        <span>{d.isOpen ? `${d.openTime} - ${d.closeTime}` : 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            )}
          </Stagger>

          <Reveal delay={0.1} className="rounded-2xl overflow-hidden bg-bone min-h-[400px] border border-ink/8">
            {settings?.googleMapsEmbedUrl ? (
              <iframe
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 400 }}
                allowFullScreen
                loading="lazy"
                title="Lil Paws location map"
              />
            ) : (
              <div className="w-full h-full min-h-[400px] flex items-center justify-center text-ink/30 text-sm">
                Map will appear here once configured in the admin panel.
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
