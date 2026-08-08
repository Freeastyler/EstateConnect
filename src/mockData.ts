import { ServiceCategory, Provider, Booking } from './types';

export const ESTATE_NAMES = [
  'Fedha Estate'
];

export const MOCK_SERVICES: ServiceCategory[] = [
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    description: 'Sparkling rooms, dusted shelves, pristine floors. Pure, fresh peace of mind.',
    icon: 'Sparkles',
    bgColor: 'bg-gradient-to-br from-teal-50/90 to-emerald-50/40 border-teal-200 text-teal-900',
    accentColor: 'border-teal-300 text-teal-700 focus:ring-teal-500',
    items: [
      { id: 'clean-1', name: 'Express Cleaning', description: 'Standard dusting, vacuuming, and mopping for bedrooms, kitchen, and bathrooms.', price: 35, duration: '1.5 hrs' },
      { id: 'clean-2', name: 'Deep Home Cleaning', description: 'Thorough, top-to-bottom sanitize including oven interiors, window sills, and tile scrubbing.', price: 75, duration: '4 hrs' },
      { id: 'clean-3', name: 'Sofa & Carpet Cleaning', description: 'Deep extraction steam clean to remove stains, odors, and dust mites from sofas and carpets.', price: 50, duration: '2 hrs' },
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Leaks sealed, drains cleared, taps pristine. Zero water worries, instantly.',
    icon: 'Droplet',
    bgColor: 'bg-gradient-to-br from-sky-50/90 to-blue-50/40 border-sky-200 text-sky-900',
    accentColor: 'border-sky-300 text-sky-700 focus:ring-sky-500',
    items: [
      { id: 'plumb-1', name: 'Leaking Pipes Repair', description: 'Emergency repairs for visible pipe leaks, burst joints, and continuous drips.', price: 45, duration: '1 hr' },
      { id: 'plumb-2', name: 'Drain Unclogging', description: 'Clearing stubborn blocks in kitchen sinks, bathtubs, or toilet lines using specialized equipment.', price: 40, duration: '1 hr' },
      { id: 'plumb-3', name: 'Faucet & Tap Installation', description: 'Replacing old fixtures with premium new faucets, taps, and water valves.', price: 30, duration: '45 mins' },
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical Support',
    description: 'Breakers fixed, mounts secured, smart lights wired. Pure safe power.',
    icon: 'Zap',
    bgColor: 'bg-gradient-to-br from-amber-50/80 to-orange-50/30 border-amber-200 text-amber-950',
    accentColor: 'border-amber-300 text-amber-700 focus:ring-amber-500',
    items: [
      { id: 'elec-1', name: 'Light & Fan Installation', description: 'Secure mounting and wiring of chandeliers, smart bulbs, ceiling fans, or outdoor lights.', price: 25, duration: '30 mins' },
      { id: 'elec-2', name: 'Appliance Repair & Setup', description: 'Troubleshooting and repair for microwaves, refrigerators, TV mounts, or washing machines.', price: 55, duration: '1.5 hrs' },
      { id: 'elec-3', name: 'Short Circuit Diagnostic', description: 'Comprehensive trace and repair for tripping breakers, faulty switches, or humming sockets.', price: 60, duration: '1.5 hrs' },
    ]
  },
  {
    id: 'laundry',
    name: 'Laundry & Dry Clean',
    description: 'Picked up dirty, returned crisp, fragrant, and folded. Pure cotton bliss.',
    icon: 'Shirt',
    bgColor: 'bg-gradient-to-br from-purple-50/80 to-fuchsia-50/30 border-purple-200 text-purple-950',
    accentColor: 'border-purple-300 text-purple-700 focus:ring-purple-500',
    items: [
      { id: 'laund-1', name: 'Wash & Fold Bundle', description: 'Everyday wear wash, machine dry, and clean fold up to 10kg.', price: 20, duration: 'Same Day' },
      { id: 'laund-2', name: 'Premium Dry Cleaning', description: 'Gentle solvent cleaning, pressing, and hanger packaging for suits, dresses, and heavy coats.', price: 12, duration: '2 Days' },
      { id: 'laund-3', name: 'Steam Ironing Only', description: 'Removal of wrinkles from shirts, trousers, or linens using industrial-grade steam pressers.', price: 15, duration: 'Same Day' },
    ]
  },
  {
    id: 'grocery',
    name: 'Grocery Delivery',
    description: 'Crisp organic greens, dairy, and warm pantry essentials. Farm-fresh, direct.',
    icon: 'ShoppingBag',
    bgColor: 'bg-gradient-to-br from-green-50/90 to-emerald-50/40 border-green-200 text-green-950',
    accentColor: 'border-green-300 text-green-700 focus:ring-green-500',
    items: [
      { id: 'groc-1', name: 'Fresh Organic Produce Box', description: 'Seasonal mix of premium fresh vegetables, greens, and hand-picked local fruits.', price: 30, duration: 'Under 2 hrs' },
      { id: 'groc-2', name: 'Daily Dairy & Breakfast Kit', description: 'One gallon organic milk, farmhouse eggs, freshly baked bread, premium butter, and local honey.', price: 25, duration: 'Under 2 hrs' },
      { id: 'groc-3', name: 'Pantry Essentials Bundle', description: 'Curated bundle including premium olive oil, long-grain rice, whole-wheat pasta, and organic sauces.', price: 45, duration: 'Under 2 hrs' },
    ]
  },
  {
    id: 'tuition',
    name: 'Kids Home Tuition',
    description: 'Cozy after-school homework help & core tutoring, in the safety of your living room.',
    icon: 'BookOpen',
    bgColor: 'bg-gradient-to-br from-[#FAF5EF] to-[#F1ECE4]/40 border-[#E8DFD4] text-[#543C30]',
    accentColor: 'border-[#D9C4B0] text-[#785035] focus:ring-[#785035]',
    items: [
      { id: 'tuit-1', name: 'Primary Homework Support', description: 'Patient assistance with daily school assignments, reading, and foundational math.', price: 25, duration: '1.5 hrs' },
      { id: 'tuit-2', name: 'STEM & Science Coaching', description: 'Interactive science experiments and fun math tutoring tailored to their curriculum.', price: 35, duration: '1.5 hrs' },
      { id: 'tuit-3', name: 'Creative Arts & Languages', description: 'Enriching home tutoring for English/Kiswahili reading comprehension and creative painting.', price: 30, duration: '1.5 hrs' },
    ]
  },
  {
    id: 'tv-mounting',
    name: 'TV Wall Mounting',
    description: 'Secure brackets, concealed cabling, perfect leveling. Ultra-clean entertainment setups.',
    icon: 'Tv',
    bgColor: 'bg-gradient-to-br from-indigo-50/90 to-violet-50/30 border-indigo-200 text-indigo-950',
    accentColor: 'border-indigo-300 text-indigo-700 focus:ring-indigo-500',
    items: [
      { id: 'tv-1', name: 'Standard TV Mounting', description: 'Secure installation on drywall, plaster, or masonry for TVs up to 55 inches (bracket not included).', price: 40, duration: '1 hr' },
      { id: 'tv-2', name: 'Premium Heavy-Duty Mounting', description: 'Full-motion articulation brackets for large displays up to 85 inches with stud tracking.', price: 65, duration: '1.5 hrs' },
      { id: 'tv-3', name: 'Wire Concealment Upgrade', description: 'In-wall cord routing or neat exterior trunking channels for a completely cable-free aesthetic.', price: 30, duration: '45 mins' },
    ]
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    description: 'Eco-friendly, odorless fumigation and targeted treatment. Guarding your home boundary.',
    icon: 'Bug',
    bgColor: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/30 border-emerald-200 text-emerald-950',
    accentColor: 'border-emerald-300 text-emerald-700 focus:ring-emerald-500',
    items: [
      { id: 'pest-1', name: 'General Crawling Insect Treatment', description: 'Safe, pet-friendly spraying targeting roaches, spiders, and ants in living areas and kitchen cabinets.', price: 50, duration: '1.5 hrs' },
      { id: 'pest-2', name: 'Termite & Wood Protection', description: 'Specialized localized chemical treatment of door frames, cupboards, and ceiling timber.', price: 85, duration: '2 hrs' },
      { id: 'pest-3', name: 'Rodent Exclusion & Baiting', description: 'Strategic placement of tamper-resistant bait stations and sealing of entry points around piping.', price: 45, duration: '1 hr' },
    ]
  },
  {
    id: 'beauty-care',
    name: 'Beauty & Personal Care',
    description: 'Professional salon styling, massage, and manicures, within the peaceful comfort of your home.',
    icon: 'Scissors',
    bgColor: 'bg-gradient-to-br from-rose-50/90 to-pink-50/30 border-rose-200 text-rose-950',
    accentColor: 'border-rose-300 text-rose-700 focus:ring-rose-500',
    items: [
      { id: 'beauty-1', name: 'Signature Home Manicure & Pedicure', description: 'Nail shaping, cuticle care, scrub, warm oil massage, and long-lasting non-toxic polish.', price: 35, duration: '1.5 hrs' },
      { id: 'beauty-2', name: 'Cozy Aromatherapy Massage', description: 'Deeply relaxing full-body tension relief using organic lavender and eucalyptus essential oils.', price: 60, duration: '1.5 hrs' },
      { id: 'beauty-3', name: 'Senior Hair Grooming & Trim', description: 'Patient and caring haircut, trimming, and light styling for senior citizens in the comfort of their home.', price: 25, duration: '1 hr' },
    ]
  },
  {
    id: 'childcare',
    name: 'Childcare & Babysitting',
    description: 'Vetted, warm, and highly playful estate sitters. Keep them safe, engaged, and smiling.',
    icon: 'Baby',
    bgColor: 'bg-gradient-to-br from-orange-50/90 to-amber-50/30 border-orange-200 text-orange-950',
    accentColor: 'border-orange-300 text-orange-700 focus:ring-orange-500',
    items: [
      { id: 'child-1', name: 'Express Babysitting (Under 4 hrs)', description: 'Attentive, engaging supervision including playtime, basic meal prep, and bedtime routines.', price: 40, duration: 'Up to 4 hrs' },
      { id: 'child-2', name: 'Weekend Day Play & Learn Sitter', description: 'Active weekend childcare with creative arts, outdoor backyard games, and healthy lunch support.', price: 65, duration: '6 hrs' },
      { id: 'child-3', name: 'Newborn & Infant Gentle Assistant', description: 'Highly experienced, specialized infant caregiver to assist with soothing, diapering, and nap schedules.', price: 55, duration: '4 hrs' },
    ]
  },
  {
    id: 'moving-transport',
    name: 'Moving & Transport',
    description: 'Safe transit, careful bubble-wrapping, and heavy-lifting helpers. From boxes to large appliances.',
    icon: 'Truck',
    bgColor: 'bg-gradient-to-br from-slate-50 to-zinc-50 border-slate-250 text-slate-950',
    accentColor: 'border-slate-350 text-slate-700 focus:ring-slate-500',
    items: [
      { id: 'move-1', name: 'Single Item / Large Appliance Move', description: 'Professional loading, safe strapping, and transit of one large item (e.g. double-door fridge, heavy sofa).', price: 35, duration: '1.5 hrs' },
      { id: 'move-2', name: 'Estate Multi-Box Shifting Kit', description: 'Two strong helpers with a clean pickup truck to move up to 15 packed boxes, safely stacked and unloaded.', price: 70, duration: '2 hrs' },
      { id: 'move-3', name: 'Furniture Assembly & Dismantling', description: 'Careful dismantling of beds, wardrobes, or dining tables at source and expert reassembly at destination.', price: 45, duration: '2 hrs' },
    ]
  },
  {
    id: 'water-utility',
    name: 'Water & Utility Services',
    description: 'Pure drinking water refills, tank cleaning, and quick gas cylinder delivery to your kitchen.',
    icon: 'Droplet',
    bgColor: 'bg-gradient-to-br from-cyan-50/90 to-blue-50/30 border-cyan-200 text-cyan-950',
    accentColor: 'border-cyan-300 text-cyan-700 focus:ring-cyan-500',
    items: [
      { id: 'water-1', name: 'Premium 20L Drinking Water Refill', description: 'Quick delivery of clean, mineral-enriched 20-liter drinking water bottles directly to your dispenser.', price: 10, duration: 'Under 1 hr' },
      { id: 'water-2', name: 'Domestic Gas Cylinder Refill (13kg)', description: 'Safe transport, professional gas leak check, and delivery of standard 13kg cooking gas.', price: 35, duration: 'Under 1 hr' },
      { id: 'water-3', name: 'Overhead Water Tank Sanitization', description: 'Drainage, complete scrubbing, disinfection, and pressure-washing of household water storage tanks.', price: 80, duration: '3 hrs' },
    ]
  },
  {
    id: 'car-services',
    name: 'Car Care & Services',
    description: 'Driveway eco-washing, battery jumpstarts, and scheduled diagnostic checks at your parking bay.',
    icon: 'Car',
    bgColor: 'bg-gradient-to-br from-blue-50/95 to-indigo-50/30 border-blue-200 text-blue-950',
    accentColor: 'border-blue-300 text-blue-700 focus:ring-blue-500',
    items: [
      { id: 'car-1', name: 'Premium Driveway Car Wash & Vacuum', description: 'Eco-friendly waterless body wash, wax finish, tyre shine, and thorough interior vacuuming in your parking spot.', price: 20, duration: '1.5 hrs' },
      { id: 'car-2', name: 'Emergency Battery Jump & Diagnostic', description: 'Immediate dispatch of a technician with heavy cables, portable jump pack, and alternator voltage check.', price: 30, duration: '30 mins' },
      { id: 'car-3', name: 'Weekly Engine Fluids & Tyre Check', description: 'Preventative maintenance inspection of engine oil, coolant, brake fluid, wiper fluid, and precise tyre pressure.', price: 15, duration: '30 mins' },
    ]
  }
];

export const MOCK_PROVIDERS: Provider[] = [
  { id: 'prov-1', name: 'David Kamau', phone: '+254 712 345 678', rating: 4.9, specialty: 'Cleaning Services', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-2', name: 'Jane Mwangi', phone: '+254 723 456 789', rating: 4.8, specialty: 'Cleaning Services', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', onDuty: false },
  { id: 'prov-3', name: 'John Doe', phone: '+254 734 567 890', rating: 4.7, specialty: 'Plumbing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-4', name: 'Amara Okafor', phone: '+254 745 678 901', rating: 4.9, specialty: 'Electrical Support', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-5', name: 'Sarah Wanjiku', phone: '+254 756 789 012', rating: 4.8, specialty: 'Laundry & Dry Clean', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', onDuty: false },
  { id: 'prov-6', name: 'Michael Chen', phone: '+254 767 890 123', rating: 4.6, specialty: 'Grocery Delivery', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-7', name: 'Grace Wairimu', phone: '+254 789 012 345', rating: 4.9, specialty: 'Kids Home Tuition', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-8', name: 'Patrick Ndung\'u', phone: '+254 711 222 333', rating: 4.9, specialty: 'TV Wall Mounting', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', onDuty: false },
  { id: 'prov-9', name: 'Benson Kilonzo', phone: '+254 722 333 444', rating: 4.8, specialty: 'Pest Control', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-10', name: 'Mercy Muthoni', phone: '+254 733 444 555', rating: 4.9, specialty: 'Beauty & Personal Care', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-11', name: 'Catherine Nafula', phone: '+254 744 555 666', rating: 4.9, specialty: 'Childcare & Babysitting', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', onDuty: false },
  { id: 'prov-12', name: 'Joseph Omondi', phone: '+254 755 666 777', rating: 4.7, specialty: 'Moving & Transport', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-13', name: 'Daniel Mwangi', phone: '+254 766 777 888', rating: 4.8, specialty: 'Water & Utility Services', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', onDuty: true },
  { id: 'prov-14', name: 'Alex Kiprop', phone: '+254 777 888 999', rating: 4.9, specialty: 'Car Care & Services', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', onDuty: false },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'EE-1042',
    residentId: 'user-1',
    residentName: 'Ian Kariri',
    phone: '+254 799 111 222',
    estateName: 'Fedha Estate',
    houseDetails: 'Block C, Apartment 4B',
    categoryName: 'Cleaning Services',
    serviceName: 'Deep Home Cleaning',
    date: '2026-06-26',
    time: '09:00 AM',
    notes: 'Please bring eco-friendly pet-safe detergent.',
    status: 'Dispatched',
    providerName: 'David Kamau',
    providerPhone: '+254 712 345 678',
    price: 75,
    createdAt: '2026-06-25T08:30:00Z'
  },
  {
    id: 'EE-1043',
    residentId: 'user-1',
    residentName: 'Ian Kariri',
    phone: '+254 799 111 222',
    estateName: 'Fedha Estate',
    houseDetails: 'Block C, Apartment 4B',
    categoryName: 'Plumbing',
    serviceName: 'Drain Unclogging',
    date: '2026-06-27',
    time: '02:00 PM',
    notes: 'Kitchen sink drain has slow outflow.',
    status: 'Pending',
    providerName: null,
    providerPhone: null,
    price: 40,
    createdAt: '2026-06-25T09:15:00Z'
  },
  {
    id: 'EE-1040',
    residentId: 'user-1',
    residentName: 'Ian Kariri',
    phone: '+254 799 111 222',
    estateName: 'Fedha Estate',
    houseDetails: 'Block C, Apartment 4B',
    categoryName: 'Grocery Delivery',
    serviceName: 'Fresh Organic Produce Box',
    date: '2026-06-24',
    time: '11:00 AM',
    notes: 'Leave at door if not home.',
    status: 'Completed',
    providerName: 'Michael Chen',
    providerPhone: '+254 767 890 123',
    price: 30,
    createdAt: '2026-06-24T10:00:00Z'
  }
];
