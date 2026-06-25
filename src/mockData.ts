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
    bgColor: 'bg-[#F0FDFA]/90 border-[#CCFBF1] text-[#115E59]',
    accentColor: 'border-[#99F6E4] text-[#0D9488] focus:ring-[#0D9488]',
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
    bgColor: 'bg-[#F0F9FF]/90 border-[#E0F2FE] text-[#075985]',
    accentColor: 'border-[#BAE6FD] text-[#0284C7] focus:ring-[#0284C7]',
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
    bgColor: 'bg-[#FFFBEB]/90 border-[#FEF3C7] text-[#78350F]',
    accentColor: 'border-[#FDE68A] text-[#D97706] focus:ring-[#D97706]',
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
    bgColor: 'bg-[#FAF5FF]/90 border-[#F3E8FF] text-[#5B21B6]',
    accentColor: 'border-[#E9D5FF] text-[#7C3AED] focus:ring-[#7C3AED]',
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
    bgColor: 'bg-[#F0FDF4]/90 border-[#DCFCE7] text-[#166534]',
    accentColor: 'border-[#BBF7D0] text-[#16A34A] focus:ring-[#16A34A]',
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
    bgColor: 'bg-[#FDFBF7]/90 border-[#F5EBE0] text-[#5C3D2E]',
    accentColor: 'border-[#E5D3C0] text-[#8B5E3C] focus:ring-[#8B5E3C]',
    items: [
      { id: 'tuit-1', name: 'Primary Homework Support', description: 'Patient assistance with daily school assignments, reading, and foundational math.', price: 25, duration: '1.5 hrs' },
      { id: 'tuit-2', name: 'STEM & Science Coaching', description: 'Interactive science experiments and fun math tutoring tailored to their curriculum.', price: 35, duration: '1.5 hrs' },
      { id: 'tuit-3', name: 'Creative Arts & Languages', description: 'Enriching home tutoring for English/Kiswahili reading comprehension and creative painting.', price: 30, duration: '1.5 hrs' },
    ]
  }
];

export const MOCK_PROVIDERS: Provider[] = [
  { id: 'prov-1', name: 'David Kamau', phone: '+254 712 345 678', rating: 4.9, specialty: 'Cleaning Services', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'prov-2', name: 'Jane Mwangi', phone: '+254 723 456 789', rating: 4.8, specialty: 'Cleaning Services', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'prov-3', name: 'John Doe', phone: '+254 734 567 890', rating: 4.7, specialty: 'Plumbing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'prov-4', name: 'Amara Okafor', phone: '+254 745 678 901', rating: 4.9, specialty: 'Electrical Support', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'prov-5', name: 'Sarah Wanjiku', phone: '+254 756 789 012', rating: 4.8, specialty: 'Laundry & Dry Clean', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' },
  { id: 'prov-6', name: 'Michael Chen', phone: '+254 767 890 123', rating: 4.6, specialty: 'Grocery Delivery', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'prov-7', name: 'Grace Wairimu', phone: '+254 789 012 345', rating: 4.9, specialty: 'Kids Home Tuition', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
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
