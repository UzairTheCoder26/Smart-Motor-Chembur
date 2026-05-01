import { Phone, MessageCircle } from "lucide-react";

export const PHONE = "+919320521888";
export const PHONE_DISPLAY = "+91 9320521888";
export const WHATSAPP_URL = "https://wa.me/919320521888";
export const ADDRESS = "Shop No. 10, BLDG No. 24, Shree Sainath CHS, Chembur West, Tilak Nagar, Chembur, Mumbai, Maharashtra 400089";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "RTO Services", href: "#rto" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const COURSES = [
  {
    name: "Manual Car Driving",
    description: "Master the classic manual transmission with confidence and full road awareness.",
    tags: ["Clutch Control", "Gear Shifting", "Hill Start", "City Traffic"],
    icon: "🚗",
    private: false,
  },
  {
    name: "Automatic Car Driving",
    description: "Premium one-on-one personalised sessions in modern automatic vehicles.",
    tags: ["Eco-Driving", "Lane Discipline", "Parking", "Low-Stress"],
    icon: "⚡",
    private: true,
  },
  {
    name: "Two-Wheeler Training",
    description: "Build balance, control and safe-rider habits from day one.",
    tags: ["Balance", "Braking", "Safe Turns", "Speed Control"],
    icon: "🏍️",
    private: false,
  },
  {
    name: "Road Test Preparation",
    description: "Targeted drills for the exact RTO test routes and manoeuvres.",
    tags: ["Mock Drills", "3-Point Turn", "Parallel Parking", "Test Routes"],
    icon: "🎯",
    private: false,
  },
  {
    name: "License Assistance (RTO)",
    description: "Documentation, slot booking & end-to-end license guidance.",
    tags: ["Documentation", "Slot Booking", "Form Help", "Guidance"],
    icon: "📋",
    private: false,
  },
  {
    name: "Flexible Batches",
    description: "Morning, evening, weekend slots. Pickup & drop available.",
    tags: ["Morning", "Evening", "Weekend", "Pickup & Drop"],
    icon: "🕐",
    private: false,
  },
];

export const RTO_SERVICES = [
  { title: "HSRP Number Plates", desc: "Official high-security registration plates fitted." },
  { title: "Vehicle Insurance", desc: "Quick policy issuance and renewals." },
  { title: "Ownership Transfer", desc: "Hassle-free RC transfer assistance." },
  { title: "Name / Address Change", desc: "Update your license details easily." },
  { title: "License Renewal & Duplicate", desc: "Get renewals and duplicates fast." },
  { title: "Complete RTO Work", desc: "End-to-end RTO compliance support." },
];

export const FAQS = [
  { q: "How long is the driving course in Chembur?", a: "Most learners complete the course in 15–21 days with daily 45-minute sessions. We tailor pace to your comfort level." },
  { q: "Do you offer pick-up and drop service?", a: "Yes — pick-up & drop is available across Chembur, Tilak Nagar, Ghatkopar and nearby areas." },
  { q: "What documents are required for a driving license in Mumbai?", a: "Aadhaar, address proof, age proof, passport-size photos and a learner's license. We help with all paperwork." },
  { q: "Do you help with the RTO driving test?", a: "Absolutely. We run mock tests on the actual RTO route and accompany you on test day." },
  { q: "Do you train with both manual and automatic cars?", a: "Yes — both manual and automatic transmission training is available." },
  { q: "I'm a nervous beginner. Can you help?", a: "Of course. Our certified instructors specialise in calming first-time and nervous drivers with patient, step-by-step coaching." },
  { q: "What are the fees and available batches?", a: "Fees depend on the course. Morning, evening and weekend batches are available. Call +91 9320521888 for current pricing." },
  { q: "Is real traffic practice included?", a: "Yes — real Mumbai traffic experience is a core part of our program, on actual roads not just empty lots." },
  { q: "Do you offer refresher training?", a: "Yes, we offer focused refresher sessions for licensed drivers regaining confidence." },
  { q: "Do you provide two-wheeler training as well?", a: "Yes, we have dedicated two-wheeler training programs for all skill levels." },
];

export const REVIEWS = [
  { name: "Priya Sharma", rating: 5, text: "Best driving school in Chembur! The instructor was so patient with me. Cleared my RTO test in the first attempt!", date: "2 weeks ago" },
  { name: "Rahul Mehta", rating: 5, text: "Took the automatic course — extremely professional, real traffic practice, and very flexible timings. Highly recommend.", date: "1 month ago" },
  { name: "Anjali Desai", rating: 5, text: "I was a nervous beginner and Smart Motor changed that completely. I drive confidently in Mumbai traffic now. Thank you!", date: "1 month ago" },
];

export const AREAS = ["Chembur", "Chembur West", "Tilak Nagar", "Ghatkopar", "Govandi", "Kurla", "Chembur Naka", "Shell Colony", "Chembur East", "Nearby Suburbs"];
