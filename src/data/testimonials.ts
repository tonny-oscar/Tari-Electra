import type { Testimonial } from '@/lib/types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Macharia',
    role: 'Landlord',
    company: '', // Company not specified, can be empty or omitted
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarFallback: 'M',
    quote: 'Tari sub-meters have ensured each tenant pays for their own usage. It’s a game changer for managing my properties efficiently.',
  },
  {
    id: '2',
    name: 'Timothy Wafula',
    role: 'Landlord',
    company: '',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarFallback: 'TW',
    quote: 'No more bill worries. The installation was quick, and the system is easy to manage. Thank you, Tari Electra.',
  },
  {
    id: '3',
    name: 'Martin Nyutu',
    role: 'Electrical Shop Owner',
    company: '',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarFallback: 'MN',
    quote: 'Satisfied customers, timely billing. Tari Electra provides excellent support and reliable products for my clients.',
  },
];
