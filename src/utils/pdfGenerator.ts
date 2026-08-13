import { jsPDF } from 'jspdf';
import { Booking, ServiceItem, ServiceCategory } from '../types';

export const ADMIN_EMAIL = 'iankariri2@gmail.com';

interface PDFBookingParams {
  booking: Booking;
  categoryName?: string;
  serviceName?: string;
}

export function generateBookingPDF({ booking, categoryName, serviceName }: PDFBookingParams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background - Dark Slate
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Line - Teal
  doc.setFillColor(45, 212, 191); // teal-400
  doc.rect(0, 40, pageWidth, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('EstateConnect Kenya', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Fedha Estate Domestic Service Dispatch Voucher', 15, 26);

  // Dispatch Ref / Date in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`REF: ${booking.id.toUpperCase()}`, pageWidth - 15, 18, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Created: ${booking.createdAt || new Date().toISOString().split('T')[0]}`, pageWidth - 15, 26, { align: 'right' });

  let y = 52;

  // Admin Notification Banner Box
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(153, 246, 228); // teal-200
  doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110); // teal-700
  doc.text('CONFIRMED DISPATCH NOTIFICATION', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Order details automatically registered and saved to your resident account.', 20, y + 11);

  y += 24;

  // Section 1: Customer & Estate Details
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 48, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Resident & Gatehouse Verification', 20, y + 9);

  doc.setLineWidth(0.2);
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y + 12, pageWidth - 20, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Resident Name:', 20, y + 20);
  doc.text('Contact Phone:', 20, y + 28);
  doc.text('Estate Sector:', 20, y + 36);
  doc.text('Gate Entry Notes:', 20, y + 44);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(booking.residentName || 'Valued Resident', 55, y + 20);
  doc.text(booking.phone || '0796502465', 55, y + 28);
  doc.text(`${booking.houseDetails || 'Fedha Sector'}, Fedha Estate Nairobi`, 55, y + 36);
  doc.text(booking.notes || 'Standard estate gate clearance required', 55, y + 44);

  y += 56;

  // Section 2: Service Details
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, pageWidth - 30, 52, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Requested Domestic Service', 20, y + 9);

  doc.line(20, y + 12, pageWidth - 20, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Category:', 20, y + 20);
  doc.text('Service:', 20, y + 28);
  doc.text('Scheduled Date:', 20, y + 36);
  doc.text('Preferred Start:', 20, y + 44);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(categoryName || booking.categoryName || 'Home Domestic Services', 55, y + 20);
  doc.text(serviceName || booking.serviceName || 'Custom Request', 55, y + 28);
  doc.text(booking.date || 'As scheduled', 55, y + 36);
  doc.text(booking.time || '09:00 AM', 55, y + 44);

  // Status & Quote Badge
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth - 75, y + 18, 55, 26, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('STATUS & QUOTE', pageWidth - 47.5, y + 24, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136); // teal-600
  doc.text((booking.status || 'PENDING').toUpperCase(), pageWidth - 47.5, y + 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Quote on Arrival', pageWidth - 47.5, y + 39, { align: 'center' });

  y += 60;

  // Security Clearance Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, y, pageWidth - 30, 25, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('Estate Security & Safety Compliance', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('• Dispatched provider will carry verified national ID & EstateConnect badge.', 20, y + 13);
  doc.text('• For security clearance verification or updates, contact Estate Support at 0796502465.', 20, y + 18);

  y += 35;

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('EstateConnect Kenya — Connecting Fedha Estate Residents with Verified Local Experts', pageWidth / 2, y, { align: 'center' });

  // Save PDF
  const filename = `EstateConnect_Booking_${booking.id || 'Order'}.pdf`;
  doc.save(filename);
}
