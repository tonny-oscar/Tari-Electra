
import type { BlogPost } from '@/lib/types';

// Initial set of blog posts
const initialBlogPosts: BlogPost[] = [
  {
    slug: 'understanding-submetering-laws',
    title: 'Navigating Sub-Metering Laws: A Landlord\'s Guide',
    date: '2024-07-20',
    excerpt: 'Understand the legal landscape of sub-metering in your region. Key regulations and compliance tips for landlords.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'legal documents contract',
    author: 'Eleanor Vance',
    category: 'Regulations',
    content: `
      <p>Sub-metering can be a powerful tool for fair utility billing and promoting energy conservation, but it's crucial for landlords to understand and comply with local and state regulations. Laws vary significantly, covering aspects like tenant notification, billing practices, and approved meter types.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Key Considerations:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>Tenant Consent and Notification:</strong> Many jurisdictions require landlords to inform tenants about sub-metering implementation and may require consent.</li>
        <li><strong>Billing Accuracy:</strong> Regulations often stipulate how charges must be calculated and presented to tenants, ensuring transparency.</li>
        <li><strong>Approved Equipment:</strong> Some areas may have standards for the types of sub-meters that can be installed.</li>
        <li><strong>Dispute Resolution:</strong> Understand the processes for handling billing disputes.</li>
      </ul>
      <p class="mt-4">Failing to comply can lead to fines and legal issues. We recommend consulting with legal counsel or a sub-metering expert like Tari Electra to ensure your practices are fully compliant. Our team stays updated on the latest regulations to help you navigate this complex area.</p>
    `,
  },
  {
    slug: 'top-5-energy-saving-tips',
    title: 'Top 5 Energy Saving Tips for Multi-Family Properties',
    date: '2024-07-15',
    excerpt: 'Implement these effective strategies to reduce energy consumption and lower utility bills in your apartment buildings or condos.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'green energy lightbulb',
    author: 'Marcus Green',
    category: 'Energy Savings',
    content: `
      <p>Managing energy costs in multi-family properties can be challenging. Here are five actionable tips to help you and your tenants save energy:</p>
      <ol class="list-decimal list-inside space-y-2 mt-4">
        <li><strong>Install Smart Thermostats:</strong> Allow for precise temperature control and scheduling, reducing wasted heating and cooling.</li>
        <li><strong>Upgrade to LED Lighting:</strong> LEDs consume significantly less energy and last much longer than traditional bulbs.</li>
        <li><strong>Promote Water Conservation:</strong> Install low-flow fixtures and educate tenants on water-saving habits, as water heating is a major energy consumer.</li>
        <li><strong>Improve Insulation and Weather Stripping:</strong> Reduce drafts and heat loss, making HVAC systems more efficient.</li>
        <li><strong>Implement Sub-Metering:</strong> When tenants are responsible for their own usage, they are more likely to conserve energy. Tari Electra can help!</li>
      </ol>
      <p class="mt-4">By adopting these measures, you can create more sustainable and cost-effective properties, benefiting both landlords and tenants.</p>
    `,
  },
  {
    slug: 'benefits-of-smart-submetering',
    title: 'The ROI of Smart Sub-Metering: Beyond Cost Savings',
    date: '2024-07-10',
    excerpt: 'Explore the multifaceted benefits of smart sub-metering, from financial returns to enhanced property value and tenant satisfaction.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'financial graph growth',
    author: 'Sophia Chen',
    category: 'Technology',
    content: `
      <p>While direct cost savings are a primary driver for adopting smart sub-metering, the return on investment (ROI) extends far beyond reduced utility bills.</p>
      <h3 class="text-xl font-semibold mt-4 mb-2">Additional ROI Drivers:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>Increased Property Value:</strong> Properties with modern, efficient utility management systems are more attractive to buyers and can command higher valuations.</li>
        <li><strong>Enhanced Tenant Attraction and Retention:</strong> Tenants appreciate fair billing and the ability to control their own costs, leading to higher satisfaction and lower turnover.</li>
        <li><strong>Operational Efficiency:</strong> Automated meter reading and billing reduce administrative burdens and potential for human error.</li>
        <li><strong>Sustainability Credentials:</strong> Demonstrating a commitment to energy conservation can improve your property's image and appeal to environmentally conscious tenants.</li>
        <li><strong>Data-Driven Insights:</strong> Smart meters provide valuable data that can be used to identify leaks, inefficiencies, and opportunities for further optimization.</li>
      </ul>
      <p class="mt-4">Investing in a smart sub-metering solution from Tari Electra is an investment in the future of your property, yielding benefits for years to come.</p>
    `,
  },
];

// Mutable array for in-memory operations.
// Deep copy initialBlogPosts to ensure modifications don't affect the const.
let mutableBlogPosts: BlogPost[] = JSON.parse(JSON.stringify(initialBlogPosts));

export function getBlogPosts(): BlogPost[] {
  // Return a copy to prevent direct mutation of the internal array from outside
  return JSON.parse(JSON.stringify(mutableBlogPosts));
}

export function findBlogPost(slug: string): BlogPost | undefined {
  const post = mutableBlogPosts.find(p => p.slug === slug);
  return post ? { ...post } : undefined; // Return a copy
}

export function addBlogPost(postData: Omit<BlogPost, 'date' | 'imageUrl' | 'imageHint'>): BlogPost {
  if (mutableBlogPosts.some(p => p.slug === postData.slug)) {
    // For this prototype, we'll throw an error if slug exists to simplify.
    // A real app might generate a unique slug or allow updates via a different mechanism.
    throw new Error(`Blog post with slug "${postData.slug}" already exists.`);
  }
  const newPost: BlogPost = {
    ...postData,
    date: new Date().toISOString().split('T')[0], // Current date
    imageUrl: 'https://placehold.co/600x400.png', // Default placeholder
    imageHint: 'article placeholder', // Default hint
  };
  mutableBlogPosts.unshift(newPost); // Add to the beginning
  return { ...newPost }; // Return a copy
}

export function updateBlogPost(slug: string, updatedPostData: Partial<Omit<BlogPost, 'slug'>>): BlogPost | null {
  const postIndex = mutableBlogPosts.findIndex(p => p.slug === slug);
  if (postIndex > -1) {
    // Ensure slug is not changed through this function
    const { slug: _, ...dataToUpdate } = updatedPostData;
    mutableBlogPosts[postIndex] = {
      ...mutableBlogPosts[postIndex],
      ...dataToUpdate,
    };
    return { ...mutableBlogPosts[postIndex] }; // Return a copy
  }
  return null;
}

export function deleteBlogPost(slug: string): boolean {
  const initialLength = mutableBlogPosts.length;
  mutableBlogPosts = mutableBlogPosts.filter(p => p.slug !== slug);
  return mutableBlogPosts.length < initialLength;
}
