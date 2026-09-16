import { useState, useEffect } from 'react';
import { PawPrint, Target, Eye } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { Loader } from '../components/States';
import { Reveal } from '../components/motion/Reveal';
import { aboutApi } from '../api/services';

export default function About() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aboutApi.get().then((res) => setDoctor(res.data.profile)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="section-pad"><Loader /></div>;

  return (
    <>
      <section className="section-pad relative overflow-hidden bg-paw-print">
        <div className="container-lp grid lg:grid-cols-2 gap-14 items-center">
          <Reveal y={30}>
            <div className="relative rounded-paw overflow-hidden bg-bone aspect-[4/5] max-w-md shadow-soft">
              {doctor?.photo?.url ? (
                <img src={doctor.photo.url} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-paw-print overflow-hidden">
                  <div aria-hidden="true" className="absolute w-[75%] h-[75%] rounded-full bg-paw-200/50 blur-2xl" />
                  <PawPrint size={72} className="relative text-paw-700/40" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="About Lil Paws" title={doctor?.name || 'Dr. Mukesh Tiwari'} />
            <Reveal delay={0.2}>
              <p className="text-paw-600 font-semibold mt-1 mb-5">{doctor?.designation || 'Veterinary Doctor & Founder'}</p>
              <p className="text-ink/65 leading-relaxed whitespace-pre-line">{doctor?.biography || doctor?.aboutText}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {doctor?.clinicStory && (
        <section className="section-pad bg-white bg-grain">
          <div className="container-lp max-w-2xl">
            <SectionHeading eyebrow="Our Story" title="The Lil Paws story" />
            <Reveal delay={0.15}>
              <p className="text-ink/65 leading-relaxed whitespace-pre-line mt-5">{doctor.clinicStory}</p>
            </Reveal>
          </div>
        </section>
      )}

      {(doctor?.mission || doctor?.vision) && (
        <section className="section-pad">
          <div className="container-lp grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {doctor?.mission && (
              <Reveal delay={0}>
                <div className="bg-white border border-ink/8 rounded-2xl p-7 h-full hover:border-paw-400 transition-colors duration-300">
                  <Target size={22} className="text-paw-500 mb-3" />
                  <h3 className="font-display font-semibold text-lg text-ink mb-2">Our Mission</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{doctor.mission}</p>
                </div>
              </Reveal>
            )}
            {doctor?.vision && (
              <Reveal delay={0.12}>
                <div className="bg-white border border-ink/8 rounded-2xl p-7 h-full hover:border-paw-400 transition-colors duration-300">
                  <Eye size={22} className="text-paw-500 mb-3" />
                  <h3 className="font-display font-semibold text-lg text-ink mb-2">Our Vision</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{doctor.vision}</p>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}
    </>
  );
}