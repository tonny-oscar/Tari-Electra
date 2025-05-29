
import fs from 'fs';
import path from 'path';
import type { BlogPost } from '@/lib/types';

const blogDataPath = path.resolve(process.cwd(), 'src/data/blogData.json');

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

function readBlogData(): BlogPost[] {
  try {
    if (fs.existsSync(blogDataPath)) {
      const fileContent = fs.readFileSync(blogDataPath, 'utf-8');
      // If file is empty or just whitespace, initialize with initialBlogPosts
      if (fileContent.trim() === '') {
        fs.writeFileSync(blogDataPath, JSON.stringify(initialBlogPosts, null, 2), 'utf-8');
        console.log('[readBlogData] Initialized blogData.json with sample data as it was empty.');
        return JSON.parse(JSON.stringify(initialBlogPosts)); // Return a copy
      }
      const data = JSON.parse(fileContent);
      // Check if data is an array. If not, it's malformed or unexpected.
      if (Array.isArray(data)) {
        return data; // Return data (could be an empty array if user deleted all posts)
      } else {
        console.warn('[readBlogData] blogData.json does not contain a valid array. Initializing with sample data.');
        fs.writeFileSync(blogDataPath, JSON.stringify(initialBlogPosts, null, 2), 'utf-8');
        return JSON.parse(JSON.stringify(initialBlogPosts)); // Return a copy
      }
    }
    // File doesn't exist, create it with initialBlogPosts
    fs.writeFileSync(blogDataPath, JSON.stringify(initialBlogPosts, null, 2), 'utf-8');
    console.log('[readBlogData] Created and initialized blogData.json with sample data.');
    return JSON.parse(JSON.stringify(initialBlogPosts)); // Return a copy
  } catch (error: any) {
    console.error('[readBlogData] Error reading or initializing blogData.json:', error.message);
    // Attempt to write initial data as a fallback in case of parse errors etc.
    try {
      fs.writeFileSync(blogDataPath, JSON.stringify(initialBlogPosts, null, 2), 'utf-8');
      console.log('[readBlogData] Initialized blogData.json with sample data after read error.');
    } catch (writeError: any) {
      console.error('[readBlogData] Error writing initial data to blogData.json after read error:', writeError.message);
    }
    return JSON.parse(JSON.stringify(initialBlogPosts)); // Return a copy of initial data as a last resort
  }
}

function writeBlogData(data: BlogPost[]): void {
  try {
    fs.writeFileSync(blogDataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[writeBlogData] Successfully wrote to blogData.json');
  } catch (error) {
    console.error('[writeBlogData] Error writing to blogData.json:', error);
  }
}

export function getBlogPosts(): BlogPost[] {
  const posts = readBlogData();
  return JSON.parse(JSON.stringify(posts));
}

export function findBlogPost(slug: string): BlogPost | undefined {
  const posts = readBlogData();
  const post = posts.find(p => p.slug === slug);
  return post ? { ...post } : undefined;
}

export function addBlogPost(postData: Omit<BlogPost, 'date'>): BlogPost {
  let posts = readBlogData();
  if (posts.some(p => p.slug === postData.slug)) {
    throw new Error(`Blog post with slug "${postData.slug}" already exists.`);
  }
  const defaultImageUrl = 'https://placehold.co/600x400.png';
  const newPost: BlogPost = {
    ...postData,
    date: new Date().toISOString().split('T')[0],
    imageUrl: postData.imageUrl || defaultImageUrl,
    imageHint: postData.imageHint || postData.title.split(' ').slice(0,2).join(' ').toLowerCase() || 'article placeholder',
  };
  posts.unshift(newPost);
  writeBlogData(posts);
  return { ...newPost };
}

export function updateBlogPost(slug: string, updatedPostData: Partial<Omit<BlogPost, 'slug' | 'date'>>): BlogPost | null {
  let posts = readBlogData();
  const postIndex = posts.findIndex(p => p.slug === slug);
  if (postIndex > -1) {
    const existingPost = posts[postIndex];
    const defaultImageUrl = 'https://placehold.co/600x400.png';

    posts[postIndex] = {
      ...existingPost,
      ...updatedPostData,
      imageUrl: updatedPostData.imageUrl || existingPost.imageUrl || defaultImageUrl,
      imageHint: updatedPostData.imageHint || existingPost.imageHint || updatedPostData.title?.split(' ').slice(0,2).join(' ').toLowerCase() || existingPost.title.split(' ').slice(0,2).join(' ').toLowerCase() || 'article image',
    };
    writeBlogData(posts);
    return { ...posts[postIndex] };
  }
  return null;
}

export function deleteBlogPost(slug: string): boolean {
  let posts = readBlogData();
  const initialLength = posts.length;
  posts = posts.filter(p => p.slug !== slug);
  const success = posts.length < initialLength;
  if (success) {
    writeBlogData(posts);
  }
  return success;
}
