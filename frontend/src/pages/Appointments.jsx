import SectionHeading from '../components/SectionHeading';
import AppointmentForm from '../components/AppointmentForm';

export default function Appointments() {
  return (
    <section className="section-pad bg-paw-print">
      <div className="container-lp">
        <SectionHeading eyebrow="Appointments" title="Book a visit for your pet" description="Fill in the details below and we'll confirm your slot shortly." align="center" />
        <div className="mt-12">
          <AppointmentForm />
        </div>
      </div>
    </section>
  );
}
