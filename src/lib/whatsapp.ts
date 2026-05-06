import { PHONE } from "@/lib/site-data";

const sanitizePhone = (phone: string) => phone.replace(/\D/g, "");

export const buildWhatsAppUrl = (message: string) => {
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${sanitizePhone(PHONE)}?text=${text}`;
};

export const buildServiceEnquiryMessage = (sectionLabel: string, title: string) =>
  `Hi Smart Motor, I am interested in ${sectionLabel}: ${title}. Please share details, fees, and available slots.`;
