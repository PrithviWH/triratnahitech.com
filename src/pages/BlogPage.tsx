import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { BLOG_CATEGORIES, BLOG_POSTS } from '../data/siteData';
import { filterByCategory } from '../utils/siteLogic';
import { ChamferCard, SectionLabel } from '../components/UiPrimitives';
import { GemMarker } from '../components/GemMotif';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const filteredPosts = filterByCategory(BLOG_POSTS, selectedCategory);
  const featuredPost = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionLabel number="01" label="Journal" />
          <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
            Blog
          </h1>
          <p className="font-body text-lg sm:text-xl text-zinc-600 mt-4 max-w-2xl">
            Notes and sample posts on website development, SEO, digital marketing, and practical guidance.
          </p>

          <div
            role="group"
            aria-label="Filter blog posts by category"
            className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-zinc-100 border border-zinc-200/80 mt-8"
          >
            {BLOG_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 rounded-lg font-display text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    active ? 'text-white' : 'text-zinc-600 hover:text-[#09090B]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="blog-filter-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-[#09090B] shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedCategory === 'All' && featuredPost && (
        <section className="py-12 sm:py-16 bg-white border-b border-zinc-200/80">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <SectionLabel number="02" label="Featured" />
            <div className="rounded-2xl bg-[#09090B] text-white p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl border border-white/10">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-400">
                  <span>{featuredPost.sampleLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-4xl tracking-tight">
                  {featuredPost.title}
                </h2>
                <p className="font-body text-base sm:text-lg text-zinc-300 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-white text-[#09090B] font-display font-semibold text-sm whitespace-nowrap shrink-0 hover:bg-zinc-100 transition-colors"
                >
                  <span>Read Sample Post</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ChamferCard
                key={post.slug}
                surface="white"
                className="p-7 flex flex-col justify-between gap-6 card-elevated-hover"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#C84B13]">
                    <span>{post.sampleLabel}</span>
                    <GemMarker size={8} color="#0F4C5C" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-body text-zinc-500">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#09090B]">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm sm:text-base text-zinc-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 font-display font-semibold text-sm text-[#09090B] hover:text-[#C84B13] transition-colors pt-4 border-t border-zinc-100"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </ChamferCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
