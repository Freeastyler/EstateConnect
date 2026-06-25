export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  bgColor: string; // Tailwind background color
  accentColor: string; // Tailwind accent border/text color
  items: ServiceItem[];
}

export interface Booking {
  id: string;
  residentId: string;
  residentName: string;
  phone: string;
  estateName: string;
  houseDetails: string;
  categoryName: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string;
  status: 'Pending' | 'Dispatched' | 'Completed';
  providerName: string | null;
  providerPhone: string | null;
  price: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'resident' | 'admin';
  estateName?: string;
  houseDetails?: string;
  phone?: string;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  specialty: string;
  avatar: string;
}
