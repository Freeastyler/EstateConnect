export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  bgColor: string; // Tailwind background color
  accentColor: string; // Tailwind accent border/text color
  image?: string;
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
  status: 'Awaiting Quote' | 'Quote Offered' | 'Pending' | 'Dispatched' | 'Completed' | 'Canceled';
  providerName: string | null;
  providerPhone: string | null;
  price: number;
  createdAt: string;
}

export type UserRole = 'resident' | 'admin' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  estateName?: string;
  houseDetails?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  specialty?: string;
  experienceYears?: string;
  coverageArea?: string;
  nationalId?: string;
  onDuty?: boolean;
  rating?: number;
  password?: string;
  createdAt?: string;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  rating: number;
  specialty: string;
  avatar: string;
  onDuty?: boolean;
}
