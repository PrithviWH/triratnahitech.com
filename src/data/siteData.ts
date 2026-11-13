import {
  normalizeWebsiteUrl,
  type ProjectCategory,
  type ProjectPreviewTheme,
} from '../utils/projectShowcase';
import { buildWhatsAppUrl, type RegionalLanguage } from '../utils/siteLogic';

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

export interface HomeFaqItem extends FaqItem {
  category: 'Web Development' | 'SEO';
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
      href: buildWhatsAppUrl('+918169598429'),
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

export const HOME_FAQ_CATEGORIES = ['All', 'Web Development', 'SEO'] as const;

export const HOME_FAQS: HomeFaqItem[] = [
  {
    id: 'home-faq-1',
    category: 'Web Development',
    question: 'What types of websites do you design and develop?',
    answer:
      'We build business websites, service showcases, product catalogues, regional-language portals, and custom web solutions—tailored to your brand and structured to turn visitors into enquiries.',
  },
  {
    id: 'home-faq-2',
    category: 'Web Development',
    question: 'Are your websites mobile-responsive and built for SEO?',
    answer:
      'Yes. Every website we develop adapts cleanly across phones, tablets, and desktops with semantic HTML, fast-loading layouts, and clear heading structure ready for search engines.',
  },
  {
    id: 'home-faq-3',
    category: 'SEO',
    question: 'How does your SEO service help Pune businesses get discovered?',
    answer:
      'We combine technical site audits, on-page keyword and metadata improvements, structured local details, and Google listing optimization so nearby customers searching for your services find you easily.',
  },
  {
    id: 'home-faq-4',
    category: 'SEO',
    question: 'Can you improve SEO on an existing website without a full rebuild?',
    answer:
      'Yes. We audit existing websites to improve page speed, mobile usability, meta tags, internal linking, and content clarity, and only suggest a redesign if the current platform limits growth.',
  },
  {
    id: 'home-faq-5',
    category: 'Web Development',
    question: 'Do you help with domain registration, hosting, and ongoing updates?',
    answer:
      'Yes. We assist with domain setup, dependable web hosting, SSL configuration, and ongoing technical or content support as your business expands.',
  },
  {
    id: 'home-faq-6',
    category: 'SEO',
    question: 'How do websites, SEO, and paid ads work together?',
    answer:
      'Your website provides a clear, credible destination for prospects, SEO builds steady organic visibility over time, and targeted paid ads capture immediate demand for key services and locations.',
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

export interface RegionalQuickPrompt {
  id: string;
  label: string;
  template: string;
}

export interface RegionalSummaryContent {
  code: RegionalLanguage;
  nativeLabel: string;
  englishLabel: string;
  eyebrow: string;
  headline: string;
  summary: string;
  highlights: [string, string, string];
  contactPromptHint: string;
  ctaLabel: string;
  prompts: RegionalQuickPrompt[];
}

export const REGIONAL_SUPPORT_COPY: Record<RegionalLanguage, RegionalSummaryContent> = {
  en: {
    code: 'en',
    nativeLabel: 'English',
    englishLabel: 'English',
    eyebrow: 'Pune & Regional Outreach',
    headline: 'Websites, Local SEO & Guidance — in Your Language',
    summary:
      'From Pune businesses to Devanagari portals like marathi.brambedkar.in and hindi.brambedkar.in, we work comfortably in English, Marathi, and Hindi.',
    highlights: [
      'Responsive websites & regional portals',
      'Local SEO, Google Business & paid ads',
      '1-to-1 guidance & digital support',
    ],
    contactPromptHint:
      'Prefer starting quickly? Choose a topic below to pre-fill your enquiry message, or write directly in English, Marathi, or Hindi.',
    ctaLabel: 'Start Enquiry',
    prompts: [
      {
        id: 'en-web',
        label: 'New Business Website',
        template:
          'Hello Triratna Hi-Tech team, we are looking to design and build a responsive website for our business in Pune. Please share the next steps.',
      },
      {
        id: 'en-seo',
        label: 'Local SEO & Google Listing',
        template:
          'Hello, we want to improve our Google search rankings, Google Business listing, and customer enquiries in Pune.',
      },
      {
        id: 'en-portal',
        label: 'Marathi / Hindi Portal',
        template:
          'Hello, we would like to build a Marathi or Hindi web portal with clean Devanagari typography and mobile readability.',
      },
    ],
  },
  mr: {
    code: 'mr',
    nativeLabel: 'मराठी',
    englishLabel: 'Marathi',
    eyebrow: 'पुणे आणि प्रादेशिक संवाद',
    headline: 'तुमच्या व्यवसायासाठी वेबसाइट, SEO आणि डिजिटल मार्गदर्शन — आता मराठीतही',
    summary:
      'गेल्या ६+ वर्षांपासून त्रिरत्न हाय-टेक पुणे आणि परिसरातील व्यवसायांसाठी वेबसाइट डेव्हलपमेंट, लोकल SEO, जाहिराती आणि marathi.brambedkar.in सारखी देवनागरी पोर्टल्स तयार करत आहे.',
    highlights: [
      'मोबाईल-फ्रेंडली वेबसाइट व मराठी पोर्टल्स',
      'गुगल बिझनेस लिस्टिंग, SEO आणि जाहिराती',
      'व्यवसाय वाढीसाठी थेट व सोपे मार्गदर्शन',
    ],
    contactPromptHint:
      'तुम्ही मराठीतही तुमचा संदेश पाठवू शकता. खालीलपैकी एक विषय निवडून संदेश आपोआप भरा किंवा स्वतःची माहिती लिहा.',
    ctaLabel: 'मराठीतून संपर्क साधा',
    prompts: [
      {
        id: 'mr-web',
        label: 'व्यवसायासाठी नवीन वेबसाइट',
        template:
          'नमस्कार त्रिरत्न हाय-टेक टीम, मला माझ्या व्यवसायासाठी एक आधुनिक आणि मोबाईलवर छान दिसणारी वेबसाइट बनवून हवी आहे. कृपया पुढील माहिती शेअर करा.',
      },
      {
        id: 'mr-seo',
        label: 'लोकल SEO व Google लिस्टिंग',
        template:
          'नमस्कार, मला आमचा व्यवसाय पुण्यातील ग्राहकांपर्यंत पोहोचवण्यासाठी लोकल SEO आणि Google बिझनेस लिस्टिंग सुधारण्यासाठी मदत हवी आहे.',
      },
      {
        id: 'mr-portal',
        label: 'मराठी बातम्या / माहिती पोर्टल',
        template:
          'नमस्कार, आम्हाला स्वच्छ देवनागरी फॉन्ट आणि जलद लोड होणारे मराठी वेब पोर्टल सुरू करायचे आहे. कृपया मार्गदर्शन करा.',
      },
    ],
  },
  hi: {
    code: 'hi',
    nativeLabel: 'हिन्दी',
    englishLabel: 'Hindi',
    eyebrow: 'पुणे और क्षेत्रीय भाषा सहयोग',
    headline: 'आपके व्यवसाय के लिए वेबसाइट, SEO और डिजिटल मार्गदर्शन — अब हिन्दी में भी',
    summary:
      'पिछले 6+ वर्षों से त्रिरत्न हाय-टेक पुणे के व्यवसायों के लिए वेबसाइट डेवलपमेंट, लोकल SEO, पेड विज्ञापन और hindi.brambedkar.in जैसे देवनागरी वेब पोर्टल तैयार कर रहा है।',
    highlights: [
      'तेज़, रिस्पॉन्सिव वेबसाइट और देवनागरी पोर्टल',
      'लोकल SEO, गूगल लिस्टिंग और डिजिटल प्रचार',
      'ऑनलाइन ग्रोथ के लिए सरल और व्यावहारिक मार्गदर्शन',
    ],
    contactPromptHint:
      'आप हिन्दी में भी अपना संदेश भेज सकते हैं। नीचे से कोई विषय चुनकर संदेश भरें या सीधे अपनी आवश्यकता लिखें।',
    ctaLabel: 'हिन्दी में संपर्क करें',
    prompts: [
      {
        id: 'hi-web',
        label: 'व्यापार के लिए नई वेबसाइट',
        template:
          'नमस्ते त्रिरत्न हाय-टेक टीम, मैं अपने व्यवसाय के लिए एक प्रोफेशनल और मोबाइल-फ्रेंडली वेबसाइट बनवाना चाहता हूँ। कृपया आगे की जानकारी साझा करें।',
      },
      {
        id: 'hi-seo',
        label: 'लोकल SEO और गूगल लिस्टिंग',
        template:
          'नमस्ते, हमें पुणे में अपने ग्राहकों तक पहुँच बढ़ाने के लिए लोकल SEO, गूगल लिस्टिंग और डिजिटल मार्केटिंग में सहायता चाहिए।',
      },
      {
        id: 'hi-portal',
        label: 'हिन्दी समाचार / जानकारी पोर्टल',
        template:
          'नमस्ते, हम साफ देवनागरी टाइपोग्राफी और तेज़ मोबाइल अनुभव वाला एक हिन्दी वेब पोर्टल शुरू करना चाहते हैं। कृपया संपर्क करें।',
      },
    ],
  },
};

