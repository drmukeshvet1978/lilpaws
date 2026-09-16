require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Admin = require('../models/Admin');
const Service = require('../models/Service');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const DoctorProfile = require('../models/DoctorProfile');
const HomepageContent = require('../models/HomepageContent');
const SiteSettings = require('../models/SiteSettings');
const BusinessHours = require('../models/BusinessHours');
const AppointmentSettings = require('../models/AppointmentSettings');

const run = async () => {
  await connectDB();
  console.log('Seeding Lil Paws database...');

  // 1. Admin account
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@lilpaws.in').toLowerCase();
  let admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    admin = await Admin.create({
      name: process.env.SEED_ADMIN_NAME || 'Dr. Mukesh Tiwari',
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD || 'ChangeThisPassword123!',
      role: 'superadmin',
    });
    console.log(`Created admin account: ${adminEmail}`);
  } else {
    console.log('Admin account already exists, skipping.');
  }

  // 2. Doctor profile (placeholder text - admin should edit via CMS)
  const doctorProfile = await DoctorProfile.getSingleton();
  if (!doctorProfile.name || doctorProfile.name === 'Dr. Mukesh Tiwari') {
    doctorProfile.name = 'Dr. Mukesh Tiwari';
    doctorProfile.designation = 'Veterinary Doctor & Founder, Lil Paws Dog Clinic';
    doctorProfile.aboutText =
      'This is placeholder content. Please update Dr. Tiwari\'s biography, clinic story, mission and vision from the Admin Panel > About / Doctor section.';
    doctorProfile.clinicStory = 'Add the real story of Lil Paws Dog Clinic & Pet Shop here from the admin panel.';
    doctorProfile.mission = 'Add your clinic mission statement here.';
    doctorProfile.vision = 'Add your clinic vision statement here.';
    await doctorProfile.save();
  }

  // 3. Services (structural placeholders - admin enables/edits real ones)
  const serviceSeeds = [
    { name: 'Veterinary Consultation', category: 'Veterinary Consultation', shortDescription: 'General health check-ups and consultations for your dog.', icon: 'stethoscope', displayOrder: 1 },
    { name: 'General Pet Care', category: 'General Pet Care', shortDescription: 'Everyday care guidance to keep your pet healthy and happy.', icon: 'heart-pulse', displayOrder: 2 },
    { name: 'Preventive Care', category: 'Preventive Care', shortDescription: 'Routine check-ups aimed at preventing health issues.', icon: 'shield-check', displayOrder: 3 },
    { name: 'Diagnostics', category: 'Diagnostics', shortDescription: 'Diagnostic support to understand your pet\'s health better.', icon: 'activity', displayOrder: 4 },
    { name: 'Vaccination', category: 'Vaccination', shortDescription: 'Vaccination guidance and administration for dogs.', icon: 'syringe', displayOrder: 5 },
    { name: 'Grooming / Hygiene', category: 'Grooming / Hygiene', shortDescription: 'Grooming and hygiene services to keep your pet fresh.', icon: 'scissors', displayOrder: 6 },
  ];

  for (const s of serviceSeeds) {
    const exists = await Service.findOne({ name: s.name });
    if (!exists) {
      const slugify = require('slugify');
      await Service.create({
        ...s,
        slug: slugify(s.name, { lower: true, strict: true }),
        fullDescription: `${s.shortDescription} Please edit this description from the Admin Panel > Services with accurate, clinic-specific details.`,
        isActive: false, // inactive by default until admin verifies & confirms this is actually offered
      });
    }
  }
  console.log('Seeded placeholder services (inactive until admin enables them).');

  // 4. FAQs (generic placeholders)
  const faqSeeds = [
    { question: 'How do I book an appointment at Lil Paws?', answer: 'You can book directly through the Appointments page on our website, or call/WhatsApp us using the contact details listed on the Contact page.', displayOrder: 1 },
    { question: 'Where is Lil Paws Dog Clinic located?', answer: 'Lil Paws Dog Clinic & Pet Shop is located on Kolar Road, Bhopal, Madhya Pradesh. Exact directions are available on our Contact page.', displayOrder: 2 },
    { question: 'Does Lil Paws also sell pet products?', answer: 'Yes, alongside veterinary care, Lil Paws operates a pet shop offering pet food, accessories and other pet care products. Browse the Pet Shop page to see what is currently available.', displayOrder: 3 },
  ];
  for (const f of faqSeeds) {
    const exists = await FAQ.findOne({ question: f.question });
    if (!exists) await FAQ.create(f);
  }
  console.log('Seeded FAQs.');

  // 5. Demo testimonial - clearly marked as demo, admin should replace with real reviews
  const demoTestimonialExists = await Testimonial.findOne({ isDemo: true });
  if (!demoTestimonialExists) {
    await Testimonial.create({
      customerName: 'Demo Customer (Sample Review)',
      petName: 'Sample Pet',
      review: 'This is placeholder demo content to show how testimonials will appear. Replace with a real customer review from the Admin Panel > Testimonials.',
      rating: 5,
      isDemo: true,
      isActive: false, // inactive so it never accidentally shows as a real review
      displayOrder: 0,
    });
  }
  console.log('Seeded demo testimonial (inactive, clearly marked).');

  // 6. Homepage content defaults
  await HomepageContent.getSingleton();
  console.log('Ensured homepage content document exists.');

  // 7. Site settings defaults
  const settings = await SiteSettings.getSingleton();
  if (!settings.address) {
    settings.address = 'Kolar Road, Bhopal, Madhya Pradesh, India';
    await settings.save();
  }
  console.log('Ensured site settings document exists.');

  // 8. Business hours defaults
  await BusinessHours.getSingleton();
  console.log('Ensured business hours document exists.');

  // 9. Appointment settings defaults
  await AppointmentSettings.getSingleton();
  console.log('Ensured appointment settings document exists.');

  console.log('\nSeeding complete!');
  console.log(`Admin login -> email: ${adminEmail} | password: ${process.env.SEED_ADMIN_PASSWORD || 'ChangeThisPassword123!'}`);
  console.log('IMPORTANT: Log in and change this password immediately, and review all placeholder/demo content before going live.\n');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
