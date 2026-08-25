import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import mongoose from 'mongoose';

dotenv.config();

const products = [
  {
    name: 'SteriFast rapid sterilization device',
    slug: 'sterifast-device',
    category: 'device',
    shortDescription: 'Chairside sterilization for small dental instruments',
    description:
      'A compact, portable device providing dual-action cleaning and sterilization for small dental instruments — endodontic files, dental burs, scaler tips and orthodontic bands — using non-ionizing radiation, in a fraction of standard autoclave time.',
    specs: [
      'Compact, chairside footprint',
      'Non-ionizing radiation sterilization',
      'Dual-action: cleaning + sterilization',
      'Built-in pre-sterilization cleaning attachment support',
      '100% microbial elimination in trials using Bacillus pumilus spore strips',
    ],
    useCases: [
      'Single-chair clinics needing fast turnaround between patients',
      'Endodontists sterilizing files and burs between root canal cases',
      'Orthodontic practices reprocessing bands and small metal tools',
      'Practices looking to reduce reliance on central autoclave queues',
    ],
    certifications: ['Patented sterilization technology', 'Clinically trial-tested efficacy'],
    badges: ['Patented', 'Award-winning'],
    image: '/assets/images/Sterifast.png',
  },
  {
    name: 'Pre-sterilization cleaning attachments',
    slug: 'cleaning-attachments',
    category: 'attachment',
    shortDescription: 'Modular attachments for debris cleaning before sterilization',
    description:
      'Specialized, modular components that fit into the SteriFast device to automate debris cleaning from dental instruments before the radiation cycle begins. Available with custom sizing to fit a clinic\u2019s specific instrument configuration.',
    specs: [
      'Modular, fits SteriFast device',
      'Automated mechanical wash cycle',
      'Removes blood, tissue and biological debris',
      'Custom sizing available',
    ],
    useCases: [
      'Clinics wanting to prevent baked-on bio-burden before sterilization',
      'High-volume practices reprocessing instruments multiple times a day',
      'Labs with non-standard bur blocks or endodontic kit sizes',
    ],
    certifications: ['Compatible add-on for SteriFast device'],
    badges: ['Custom fitting available'],
    image: '/assets/images/Cleaning-Instrument.png',
  },
  {
    name: 'Dental surgical instruments',
    slug: 'surgical-instruments',
    category: 'surgical',
    shortDescription: 'Core surgical instrument catalog for dental practices',
    description:
      'A catalog of fundamental dental surgical instruments manufactured and supplied to clinics, hospital networks and laboratories.',
    specs: [
      'Full surgical instrument range',
      'Supplied to clinics and hospital networks',
      'Manufactured for institutional-grade durability',
    ],
    useCases: [
      'New clinic setups equipping a full operatory',
      'Hospital dental departments restocking core instrument sets',
      'Dental colleges outfitting student clinics',
    ],
    certifications: ['Manufactured to dental-grade material standards'],
    badges: [],
    image: '/assets/images/Surgical-Instruments.png',
  },
  {
    name: 'Diode dental laser',
    slug: 'diode-dental-laser',
    category: 'clinical-hardware',
    shortDescription: 'High-precision soft-tissue laser for minimally invasive procedures',
    description:
      'A high-precision soft-tissue laser configured near 810nm wavelength, designed for minimally invasive surgeries, pocket sterotomy and rapid-healing endodontic disinfection.',
    specs: [
      '~810nm wavelength',
      'Minimally invasive soft-tissue surgery',
      'Rapid-healing endodontic disinfection',
      'Precision-focused beam control',
    ],
    useCases: [
      'Periodontists performing pocket sterotomy procedures',
      'Endodontists needing rapid canal disinfection',
      'General practices offering minimally invasive soft-tissue procedures',
    ],
    certifications: ['Medical-grade laser hardware'],
    badges: [],
    image: '/assets/images/Diode-Laser.png',
  },
  {
    name: 'Dental treatment unit',
    slug: 'dental-treatment-unit',
    category: 'clinical-hardware',
    shortDescription: 'Integrated ergonomic workstation for the operatory',
    description:
      'An integrated workstation comprising an ergonomic patient chair, assistant instrument tray, spittoon and LED operating light array.',
    specs: [
      'Ergonomic patient chair',
      'Assistant instrument tray',
      'Integrated spittoon',
      'LED operating light array',
    ],
    useCases: [
      'New clinic buildouts needing a full chairside setup',
      'Practices upgrading from older, non-ergonomic units',
      'Multi-chair clinics standardizing operatory equipment',
    ],
    certifications: ['Designed for extended clinical use, ergonomic compliance'],
    badges: [],
    image: '/assets/images/Workstation.png',
  },
  {
    name: 'Oil-free compressor',
    slug: 'oil-free-compressor',
    category: 'clinical-hardware',
    shortDescription: 'Medical-grade, low-noise compressor for pneumatic handpieces',
    description:
      'A medical-grade, low-noise compressor unit that powers pneumatic handpieces while keeping moisture and oil contaminants out of the sterile field.',
    specs: [
      'Oil-free, medical grade',
      'Low-noise operation',
      'Keeps the sterile field contaminant-free',
      'Powers pneumatic handpieces reliably',
    ],
    useCases: [
      'Clinics needing quieter equipment for patient comfort',
      'Practices prioritizing contamination-free air supply',
      'Multi-chair setups needing consistent handpiece power',
    ],
    certifications: ['Medical-grade compressor rating'],
    badges: [],
    image: '/assets/images/OilFree-Compressor.png',
  },
  {
    name: 'Laboratory heating equipment',
    slug: 'lab-heating-equipment',
    category: 'lab-equipment',
    shortDescription: 'Heating equipment for dental laboratory workflows',
    description:
      'Laboratory heating equipment supplied as part of Quest Dental Products\u2019 catalog for dental labs and institutions, including digital heating wax pots, magnification viewers and instrument transport trolleys.',
    specs: [
      'Digital heating wax pots',
      'Laboratory magnification viewers',
      'Instrument transport trolleys',
    ],
    useCases: [
      'In-house dental labs producing custom prosthetics',
      'Dental colleges running lab training programs',
      'Practices with on-site restorative fabrication',
    ],
    certifications: ['Lab-grade equipment build'],
    badges: [],
    image: '/assets/images/Heating-Device.png',
  },
  {
    name: 'Restorative materials',
    slug: 'restorative-materials',
    category: 'restorative',
    shortDescription: 'Precision ceramic crowns, bridges and custom prosthetics',
    description:
      'Precision ceramic crowns and bridges, plus custom-milled indirect prosthetics designed for anatomical accuracy.',
    specs: [
      'Precision ceramic crowns and bridges',
      'Custom-milled indirect prosthetics',
      'Designed for anatomical accuracy',
    ],
    useCases: [
      'Prosthodontists needing custom-fit restorations',
      'Clinics offering same-network crown and bridge work',
      'Labs producing indirect prosthetics for partner clinics',
    ],
    certifications: ['Anatomically accurate custom milling'],
    badges: [],
    image: '/assets/images/Restorative-Materials.png',
  },
  {
    name: 'UV instrument storage cabinet',
    slug: 'uv-storage-cabinet',
    category: 'storage-safety',
    shortDescription: 'Medical-grade UV cabinet for maintaining instrument integrity',
    description:
      'A specialized medical-grade ultraviolet storage cabinet for maintaining instrument integrity between uses.',
    specs: [
      'Medical-grade UV exposure',
      'Maintains sterile instrument integrity',
      'Designed for post-sterilization storage',
    ],
    useCases: [
      'Clinics needing safe storage between sterilization and use',
      'Practices maintaining strict cross-contamination protocols',
      'Multi-chair clinics storing shared instrument sets',
    ],
    certifications: ['Medical-grade UV safety design'],
    badges: [],
    image: '/assets/images/UV-Cabinet.png',
  },
];

const services = [
  {
    name: 'Turnkey clinic installations',
    slug: 'turnkey-installations',
    description: 'Field engineers manage physical layout, line hookups, calibration and electronic safety mapping for new clinical setups.',
    detail: 'Our field engineering team handles the entire installation from planning to sign-off — physical layout, line hookups, equipment calibration and electronic safety mapping — so a new clinic setup is ready to see patients without in-house technical overhead.',
    icon: 'ti-settings',
  },
  {
    name: 'On-site calibration',
    slug: 'on-site-calibration',
    description: 'Periodic diagnostic testing for SteriFast units to validate uniform radiation delivery and ensure bio-safety compliance.',
    detail: 'Regular diagnostic testing for SteriFast units confirms uniform radiation delivery across every cycle and keeps your clinic aligned with local bio-safety standards. We recommend scheduling this periodically rather than only when something seems off.',
    icon: 'ti-adjustments',
  },
  {
    name: 'Clinical staff training',
    slug: 'clinical-staff-training',
    description: 'Certified onboarding seminars covering operational mechanics and cross-contamination prevention protocols.',
    detail: 'Certified onboarding seminars for clinical staff cover the operational mechanics of each device plus cross-contamination prevention protocols — built for teams that are new to the equipment or onboarding new hires.',
    icon: 'ti-presentation',
  },
  {
    name: 'Warranty and servicing',
    slug: 'warranty-and-servicing',
    description: 'Technical servicing, electronic repairs and component replacement for hardware lines.',
    detail: 'Our servicing team handles technical repairs, electronic faults and component replacement across the hardware line, backed by manufacturer warranty coverage where applicable.',
    icon: 'ti-tool',
  },
  {
    name: 'Bulk volume fulfillment',
    slug: 'bulk-volume-fulfillment',
    description: 'Dedicated manufacturing pipelines for wholesale contracts serving medical colleges, university labs and regional distributors.',
    detail: 'For institutional buyers — medical colleges, university labs and regional distributors — we run dedicated manufacturing and logistics pipelines sized for wholesale volume, with a single point of contact managing the contract.',
    icon: 'ti-package',
  },
  {
    name: 'Custom fabrication',
    slug: 'custom-fabrication',
    description: 'Tailored engineering for institutional buyers, such as modifying tray slots or clean-rack fittings for specific instrument kits.',
    detail: 'When a clinic or lab has non-standard instrument kits, our engineering team can modify tray slots or clean-rack fittings to match — a common need for practices with legacy or specialty equipment.',
    icon: 'ti-tool',
  },
];

async function run() {
  await connectDB();
  await Product.deleteMany({});
  await Service.deleteMany({});
  await Product.insertMany(products);
  await Service.insertMany(services);
  console.log('Seed data inserted');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});