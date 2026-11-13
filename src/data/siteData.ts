import {
  normalizeWebsiteUrl,
  type ProjectCategory,
  type ProjectPreviewTheme,
} from '../utils/projectShowcase';

export interface NavItem {
  index: string;
  label: string;
  path: string;
}

export interface ClientItem {
  id: string;
  name: string;
  monogram: string;
  category: 'Real Estate' | 'Construction' | 'News' | 'Food' | 'Other';
  focus: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  domain: string;
  url: string;
  category: ProjectCategory;
  scope: string;
  caption: string;
  deliverables: [string, string];
  featured?: boolean;
  previewTheme: ProjectPreviewTheme;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  attribution: string;
}

export interface CareerRole {
  id: string;
  title: string;
  location: string;
  type: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  sampleLabel: string;
  category: 'Web Development' | 'Digital Marketing' | 'Guidance';
  date: string;
  readTime: string;
  excerpt: string;
  featured?: boolean;
  content: string[];
}

export interface TeamMemberPlaceholder {
  id: string;
  label: string;
  roleLabel: string;
  facet: string;
}

export const SITE_INFO = {
  name: 'Triratna Hi-Tech',
  email: 'triratnahitech@gmail.com',
  phoneDisplay: '(+91) 8169598429',
  phoneRaw: '+918169598429',
  phoneShort: '8169598429',
  address: 'Charholi Kh. Pune',
  hours: '9am - 6pm',
  copyright: '© 2026 Triratna Hi-Tech. All rights reserved.',
  mapEmbedUrl: 'https://www.google.com/maps?q=Charholi%20Kh.%20Pune&output=embed',
  consentText:
    'I consent to use of provided personal data for the purpose of responding to the request as described in Privacy Policy which I have read. I may withdraw my consent at any time.',
  socials: [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61583491021037',
      external: true,
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/+918169598429',
      external: true,
    },
  ],
} as const;

export const NAV_ITEMS: NavItem[] = [
  { index: '01', label: 'Home', path: '/' },
  { index: '02', label: 'Services', path: '/services' },
  { index: '03', label: 'About', path: '/about' },
  { index: '04', label: 'Clients', path: '/clients' },
  { index: '05', label: 'Projects', path: '/projects' },
  { index: '06', label: 'Testimonials', path: '/testimonials' },
  { index: '07', label: 'Careers', path: '/careers' },
  { index: '08', label: 'Blog', path: '/blog' },
  { index: '09', label: 'Contact', path: '/contact' },
];

export const HOME_COPY = {
  hero: {
    badge: '6+ Years',
    sub: 'Digital marketing and web development that help Pune businesses grow with confidence.',
    cta: 'Get Started',
  },
  aboutTeaser: {
    title: 'About Triratna Hi-Tech',
    text: 'For 6+ years, Triratna Hi-Tech has helped businesses grow with thoughtful digital marketing, website development, and practical guidance.',
    cta: 'Meet Our Team',
  },
  services: {
    title: 'Services That Grow',
    tiles: [
      {
        id: 'web',
        number: '01',
        title: 'Website design and development',
        description:
          'Build a fast, responsive website tailored to your business and ready to grow with you.',
        variant: 'browser' as const,
      },
      {
        id: 'marketing',
        number: '02',
        title: 'SEO, paid ads, social media, promotion',
        description:
          'Reach the right audience with SEO, paid ads, social media marketing, and practical promotion.',
        variant: 'chart' as const,
      },
      {
        id: 'guidance',
        number: '03',
        title: 'Guidance',
        description:
          'Get expert support with business growth, online reputation, AI tools, and digital skills.',
        variant: 'compass' as const,
      },
    ],
  },
  clientStory: {
    label: 'Client Stories',
    quote:
      'Triratna Hi-Tech helped us strengthen our online presence and reach more customers. Their team made every step clear and supportive.',
    // TODO: Replace with verified client attribution once confirmed
    attribution: 'Client name - TBD',
  },
  clientsSection: {
    title: 'Our Clients',
    text: "A glimpse of the people, projects, and digital milestones we've helped bring to life.",
  },
  process: [
    {
      step: '01',
      label: 'Plan',
      caption: 'Map business goals and the right digital direction.',
    },
    {
      step: '02',
      label: 'Build',
      caption: 'Create websites and campaigns suited to your audience.',
    },
    {
      step: '03',
      label: 'Grow',
      caption: 'Strengthen visibility with ongoing support and guidance.',
    },
  ],
  closingCta: {
    title: "Let's Grow Together",
    text: "Ready to grow your business online? Let's talk about the right digital marketing and website solutions for you.",
    cta: 'Connect',
  },
};

export const SERVICES_STACK = [
  {
    index: '01',
    title: 'Website Design & Development',
    summary:
      'Build a website that works beautifully on every screen and helps turn visitors into customers.',
    accent: 'cream' as const,
  },
  {
    index: '02',
    title: 'SEO & Digital Marketing',
    summary:
      'Reach the right people with SEO, paid campaigns, Google listings, and practical digital marketing.',
    accent: 'saffron' as const,
  },
  {
    index: '03',
    title: 'Guidance & Digital Support',
    summary:
      'From AI guidance to business promotion, get hands-on support to grow your brand online.',
    accent: 'teal' as const,
  },
];

export const SERVICE_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What website services do you offer?',
    answer:
      'We design and develop websites tailored to your goals, from business websites and online stores to custom web solutions.',
  },
  {
    id: 'faq-2',
    question: 'Can you help improve my SEO?',
    answer:
      'Our SEO services include audits, on-page improvements, and practical strategies to help your business become easier to find online.',
  },
  {
    id: 'faq-3',
    question: 'What digital marketing services are available?',
    answer:
      'Yes. We support digital marketing through paid ads, business promotion, Google listings, and online reputation management.',
  },
  {
    id: 'faq-4',
    question: 'Do you provide domains and hosting?',
    answer:
      'We help with domain registration and web hosting, and can guide you in choosing options that suit your website.',
  },
  {
    id: 'faq-5',
    question: 'Can you guide my business growth?',
    answer:
      'Yes. With 6+ years of experience, we offer guidance for business setup, brand building, growth, and digital skills.',
  },
];

// TODO: Swap monogram tiles with real client logo SVG/image assets when provided
export const CLIENTS_DATA: ClientItem[] = [
  {
    id: 'care32',
    name: 'Care32',
    monogram: 'C32',
    category: 'Other',
    focus: 'Healthcare & Dental Digital Presence',
  },
  {
    id: 'kimaya-masale',
    name: 'Kimaya Masale',
    monogram: 'KM',
    category: 'Food',
    focus: 'Food & Spice Brand Promotion',
  },
  {
    id: 'saksham-real-estate',
    name: 'Saksham Real Estate',
    monogram: 'SR',
    category: 'Real Estate',
    focus: 'Property Visibility & Lead Support',
  },
  {
    id: 'affan-real-estate',
    name: 'Affan Real Estate',
    monogram: 'AR',
    category: 'Real Estate',
    focus: 'Real Estate Web & Local Reach',
  },
  {
    id: 'krupankit-developers',
    name: 'Krupankit Developers',
    monogram: 'KD',
    category: 'Construction',
    focus: 'Developer Showcase & Campaigns',
  },
  {
    id: 'aadhunik-step-construction',
    name: 'Aadhunik Step Construction',
    monogram: 'ASC',
    category: 'Construction',
    focus: 'Construction Brand Online Home',
  },
  {
    id: 'samvidhan-live24-news',
    name: 'Samvidhan Live24 News',
    monogram: 'SL24',
    category: 'News',
    focus: 'News Media & Channel Support',
  },
  {
    id: 'br-ambedkar',
    name: 'BR Ambedkar',
    monogram: 'BRA',
    category: 'Other',
    focus: 'Community Web Portal (brambedkar.in)',
  },
];

export const CLIENT_CATEGORIES = [
  'All',
  'Real Estate',
  'Construction',
  'News',
  'Food',
  'Other',
] as const;

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'constitution-brambedkar',
    title: 'Constitution of India Portal',
    domain: 'constitution.brambedkar.in',
    url: normalizeWebsiteUrl('constitution.brambedkar.in'),
    category: 'Knowledge & Portals',
    scope: 'Interactive Reading Portal',
    caption:
      'Structured constitutional hub organizing parts, articles, and schedules for clean web reading.',
    deliverables: ['Structured Article Index', 'Distraction-Free Reader'],
    featured: true,
    previewTheme: 'constitution',
  },
  {
    id: 'kimaya-food-products',
    title: 'Kimaya Food Products',
    domain: 'kimayafoodproducts.com',
    url: normalizeWebsiteUrl('kimayafoodproducts.com'),
    category: 'Business & Brands',
    scope: 'Brand Storefront & Catalogue',
    caption:
      'Spice brand showcase crafted for Kimaya Masale highlighting pure blends and trade inquiries.',
    deliverables: ['Product Showcase UI', 'Distributor Inquiry Flow'],
    featured: true,
    previewTheme: 'kimaya',
  },
  {
    id: 'saksham-real-estate',
    title: 'Saksham Real Estate',
    domain: 'sakshamrealestate.in',
    url: normalizeWebsiteUrl('sakshamrealestate.in'),
    category: 'Business & Brands',
    scope: 'Property Showcase & Lead Flow',
    caption:
      'Residential and commercial property platform built for clear discovery and buyer inquiries.',
    deliverables: ['Property Listing Cards', 'Lead Capture Flow'],
    featured: true,
    previewTheme: 'saksham',
  },
  {
    id: 'care32-dentist',
    title: 'Care32 Dental Clinic',
    domain: 'care32-dentist.com',
    url: normalizeWebsiteUrl('care32-dentist.com'),
    category: 'Business & Brands',
    scope: 'Healthcare Presence & Booking',
    caption:
      'Reassuring dental clinic site spotlighting treatments, patient comfort, and visit booking.',
    deliverables: ['Treatment Directory', 'Patient Appointment Desk'],
    featured: true,
    previewTheme: 'care32',
  },
  {
    id: 'askk-international',
    title: 'ASKK International',
    domain: 'askkinternational.com',
    url: normalizeWebsiteUrl('askkinternational.com'),
    category: 'Business & Brands',
    scope: 'Corporate & Global Trade Site',
    caption:
      'International trade presence showcasing export capabilities and global partner outreach.',
    deliverables: ['Corporate Brand System', 'Partner Inquiry Portal'],
    featured: true,
    previewTheme: 'askk',
  },
  {
    id: 'music-brambedkar',
    title: 'Dr. Ambedkar Music Archive',
    domain: 'music.brambedkar.in',
    url: normalizeWebsiteUrl('music.brambedkar.in'),
    category: 'Knowledge & Portals',
    scope: 'Cultural Audio Collection',
    caption:
      'Dedicated streaming portal curating inspirational songs and audio tributes with smooth playback.',
    deliverables: ['Curated Audio Playlists', 'Mobile-First Player'],
    previewTheme: 'music',
  },
  {
    id: 'quotes-brambedkar',
    title: 'Selected Quotes Index',
    domain: 'quotes.brambedkar.in',
    url: normalizeWebsiteUrl('quotes.brambedkar.in'),
    category: 'Knowledge & Portals',
    scope: 'Editorial Quote Library',
    caption:
      'Typographic library organizing timeless excerpts by topic for quick reading and sharing.',
    deliverables: ['Topic Filter Library', 'Shareable Quote Cards'],
    previewTheme: 'quotes',
  },
  {
    id: 'walls-brambedkar',
    title: 'Digital Wallpapers Gallery',
    domain: 'walls.brambedkar.in',
    url: normalizeWebsiteUrl('walls.brambedkar.in'),
    category: 'Knowledge & Portals',
    scope: 'Visual Artwork Repository',
    caption:
      'High-resolution wallpaper gallery built for crisp artwork previews across desktop and mobile.',
    deliverables: ['Responsive Grid Previews', 'Device Format Downloads'],
    previewTheme: 'walls',
  },
  {
    id: 'history-brambedkar',
    title: 'Historical Timeline Archive',
    domain: 'history.brambedkar.in',
    url: normalizeWebsiteUrl('history.brambedkar.in'),
    category: 'Knowledge & Portals',
    scope: 'Chronological Web Archive',
    caption:
      'Chronological milestone explorer guiding readers through key historical events and records.',
    deliverables: ['Interactive Chronology', 'Readable Monograph Cards'],
    previewTheme: 'history',
  },
  {
    id: 'news-brambedkar',
    title: 'Community News Dispatch',
    domain: 'news.brambedkar.in',
    url: normalizeWebsiteUrl('news.brambedkar.in'),
    category: 'News & Regional',
    scope: 'Editorial News Publication',
    caption:
      'Fast-loading news portal designed for daily reporting, regional coverage, and clean reading.',
    deliverables: ['Broadsheet Edition Grid', 'Fast Article Pages'],
    previewTheme: 'news',
  },
  {
    id: 'hindi-brambedkar',
    title: 'Hindi Publication Portal',
    domain: 'hindi.brambedkar.in',
    url: normalizeWebsiteUrl('hindi.brambedkar.in'),
    category: 'News & Regional',
    scope: 'Hindi Language Web Edition',
    caption:
      'Dedicated Devanagari Hindi edition tailored for comfortable reading and wide accessibility.',
    deliverables: ['Devanagari Typography', 'Regional Edition Index'],
    previewTheme: 'hindi',
  },
  {
    id: 'marathi-brambedkar',
    title: 'Marathi Publication Portal',
    domain: 'marathi.brambedkar.in',
    url: normalizeWebsiteUrl('marathi.brambedkar.in'),
    category: 'News & Regional',
    scope: 'Marathi Language Web Edition',
    caption:
      'Marathi reading portal crafted with crisp regional typography and effortless mobile browsing.',
    deliverables: ['Marathi Editorial Layout', 'Mobile Reading Experience'],
    previewTheme: 'marathi',
  },
];

export const PROJECT_CATEGORIES = [
  'All',
  'Business & Brands',
  'Knowledge & Portals',
  'News & Regional',
] as const;

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'story-1',
    quote:
      'Triratna Hi-Tech helped us strengthen our online presence with a polished website and practical marketing guidance. Their team made every step feel clear and manageable.',
    // TODO: Add verified client name and organization when available
    attribution: 'Client name - TBD',
  },
];

// TODO: Populate verified team member profiles when supplied
export const TEAM_PLACEHOLDERS: TeamMemberPlaceholder[] = [
  {
    id: 'team-1',
    label: 'Team Member - TODO',
    roleLabel: 'Role - TODO (Web & Strategy)',
    facet: '01',
  },
  {
    id: 'team-2',
    label: 'Team Member - TODO',
    roleLabel: 'Role - TODO (SEO & Digital Marketing)',
    facet: '02',
  },
  {
    id: 'team-3',
    label: 'Team Member - TODO',
    roleLabel: 'Role - TODO (Design & Guidance)',
    facet: '03',
  },
];

// Add open roles here to render active listings on /careers
export const OPEN_ROLES: CareerRole[] = [];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'sample-post-responsive-business-websites',
    title: 'Planning a Fast, Clear Business Website in Pune',
    sampleLabel: 'Sample post - replace',
    category: 'Web Development',
    date: 'Sample Date',
    readTime: '3 min read',
    featured: true,
    excerpt:
      'Sample post - replace: A practical overview of structure, mobile readability, and clarity when launching a business website.',
    content: [
      'Sample post - replace. This placeholder article demonstrates the Triratna Hi-Tech blog post detail layout, typography hierarchy, and reading progress bar.',
      'When planning a website for a growing business in Pune, clear navigation, responsive screens across mobile and desktop, and straightforward inquiry paths help visitors understand what you offer without friction.',
      'Replace this sample entry in src/data/siteData.ts with your published editorial content when ready.',
    ],
  },
  {
    slug: 'sample-post-local-seo-google-listings',
    title: 'Strengthening Local Visibility with SEO and Google Listings',
    sampleLabel: 'Sample post - replace',
    category: 'Digital Marketing',
    date: 'Sample Date',
    readTime: '4 min read',
    excerpt:
      'Sample post - replace: Practical steps for aligning on-page SEO, accurate business listings, and targeted promotion.',
    content: [
      'Sample post - replace. This placeholder article illustrates how digital marketing posts render inside the Triratna Hi-Tech journal.',
      'Consistent local details, structured page titles, and clear service descriptions make it easier for customers searching nearby to discover your business.',
      'Replace this sample entry in src/data/siteData.ts with your published editorial content when ready.',
    ],
  },
  {
    slug: 'sample-post-practical-ai-digital-guidance',
    title: 'Practical Digital Skills and AI Guidance for Small Teams',
    sampleLabel: 'Sample post - replace',
    category: 'Guidance',
    date: 'Sample Date',
    readTime: '3 min read',
    excerpt:
      'Sample post - replace: Building day-to-day confidence with digital channels, reputation care, and practical tools.',
    content: [
      'Sample post - replace. This placeholder article demonstrates the Guidance category filter and detail view.',
      'Technology works best when teams understand how to maintain their channels, respond to customers, and use modern tools step by step.',
      'Replace this sample entry in src/data/siteData.ts with your published editorial content when ready.',
    ],
  },
];

export const BLOG_CATEGORIES = [
  'All',
  'Web Development',
  'Digital Marketing',
  'Guidance',
] as const;
