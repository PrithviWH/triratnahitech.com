export interface LeadFormValues {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export interface LeadFormErrors {
  name?: string;
  email?: string;
  message?: string;
  consent?: string;
}

export interface PageSeoMeta {
  title: string;
  description: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateNewsletterEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Please enter your email address.';
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validateLeadForm(values: LeadFormValues): {
  isValid: boolean;
  errors: LeadFormErrors;
} {
  const errors: LeadFormErrors = {};

  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  const emailError = validateNewsletterEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Please enter a brief message (at least 10 characters).';
  }

  if (!values.consent) {
    errors.consent = 'Please confirm your consent before submitting.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function filterByCategory<T extends { category: string }>(
  items: readonly T[],
  selectedCategory: string
): T[] {
  if (!selectedCategory || selectedCategory === 'All') {
    return [...items];
  }
  return items.filter((item) => item.category === selectedCategory);
}

export function getNextIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}

export function getPrevIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current - 1 + length) % length;
}

export function getPageSeo(pathname: string): PageSeoMeta {
  if (pathname === '/') {
    return {
      title: 'Digital Marketing & Web Development in Pune | Triratna Hi-Tech',
      description:
        'Triratna Hi-Tech helps Pune businesses grow with SEO, digital marketing, paid ads, and website design and development. Backed by 6+ years of experience.',
    };
  }
  if (pathname === '/services') {
    return {
      title: 'Our Services | Triratna Hi-Tech Pune',
      description:
        'Website design and development, SEO, paid campaigns, Google listings, and practical guidance from Triratna Hi-Tech in Pune.',
    };
  }
  if (pathname === '/about') {
    return {
      title: 'About Triratna Hi-Tech | Your Digital Growth Partner',
      description:
        'For 6+ years, Triratna Hi-Tech has helped businesses grow with thoughtful web development, digital marketing, SEO and practical guidance from Pune.',
    };
  }
  if (pathname === '/clients') {
    return {
      title: 'Our Clients | Triratna Hi-Tech Pune',
      description:
        "A glimpse of the people, projects, and digital milestones Triratna Hi-Tech has helped bring to life across Pune and beyond.",
    };
  }
  if (pathname === '/projects') {
    return {
      title: 'Our Projects | Triratna Hi-Tech Pune',
      description:
        'A selection of web development, digital marketing, and channel launch projects shaped with Triratna Hi-Tech clients.',
    };
  }
  if (pathname === '/testimonials') {
    return {
      title: 'Client Stories | Triratna Hi-Tech Pune',
      description:
        'Hear how Triratna Hi-Tech digital marketing, website development, and business-growth support helps clients move forward confidently.',
    };
  }
  if (pathname === '/careers') {
    return {
      title: 'Careers | Grow With Us at Triratna Hi-Tech',
      description:
        'Bring your ideas to Triratna Hi-Tech in Pune and help businesses grow through thoughtful digital marketing and web development.',
    };
  }
  if (pathname.startsWith('/blog')) {
    return {
      title: 'Blog | Triratna Hi-Tech Insights',
      description:
        'Articles and sample guides on website development, SEO services, digital marketing in Pune, and practical digital guidance.',
    };
  }
  if (pathname === '/contact') {
    return {
      title: "Let's Talk | Contact Triratna Hi-Tech Pune",
      description:
        'Contact Triratna Hi-Tech in Charholi Kh. Pune at (+91) 8169598429 or triratnahitech@gmail.com for websites, SEO, and digital marketing.',
    };
  }
  if (pathname === '/admin') {
    return {
      title: 'Submissions Inbox | Triratna Hi-Tech',
      description:
        'Authorized administrator inbox for Triratna Hi-Tech enquiries, career applications, and newsletter subscribers.',
    };
  }
  return {
    title: 'Digital Marketing & Web Development in Pune | Triratna Hi-Tech',
    description:
      'Triratna Hi-Tech helps Pune businesses grow with SEO, digital marketing, paid ads, and website design and development. Backed by 6+ years of experience.',
  };
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  const trimmed = message?.trim();
  if (!trimmed) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(trimmed)}`;
}

export function toggleAccordionId(
  currentOpenId: string | null,
  clickedId: string,
): string | null {
  if (!clickedId) return null;
  return currentOpenId === clickedId ? null : clickedId;
}


