import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BLOG_POSTS } from '../data/siteData';
import { Button, SectionLabel } from '../components/UiPrimitives';
import { SeoHead } from '../components/SeoHead';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const [readPercent, setReadPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setReadPercent(100);
        return;
      }
      setReadPercent(Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  if (!post) {
    return (
      <section className="py-24 px-5 sm:px-8 max-w-3xl mx-auto space-y-6">
        <h1 className="font-display font-bold text-4xl">Post not found</h1>
        <p className="font-body text-lg text-zinc-600">
          The requested blog article could not be found.
        </p>
        <Button to="/blog" variant="primary">
          <span>Back to Blog</span>
        </Button>
      </section>
    );
  }

  return (
    <article>
      <SeoHead
        customTitle={`${post.title} | Triratna Hi-Tech Blog`}
        customDescription={post.excerpt}
      />

      <div
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuenow={readPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-16 left-0 right-0 h-1 bg-zinc-200 z-30"
      >
        <div
          className="h-full bg-[#0F4C5C] transition-[width] duration-150"
          style={{ width: `${readPercent}%` }}
        />
      </div>

      <header className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F4C5C] hover:text-[#C84B13] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Blog</span>
          </Link>

          <div>
            <SectionLabel number="01" label={post.sampleLabel} />
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.08] tracking-tight text-[#09090B]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 mt-5">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <div className="py-14 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-6">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="font-body text-lg leading-relaxed text-zinc-700">
              {paragraph}
            </p>
          ))}

          <div className="pt-10 mt-10 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4">
            <Button to="/blog" variant="ghost">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>All Posts</span>
            </Button>
            <Button to="/contact" variant="primary">
              <span>Let&apos;s Talk</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
