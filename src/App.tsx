/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import {
  ScrollProgress,
  Toast,
  ToastState,
} from './components/UiPrimitives';
import { SeoHead } from './components/SeoHead';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { FirebaseProvider } from './components/FirebaseProvider';
import { extractHashTargetId, resolveScrollBehavior } from './utils/siteLogic';

import HomePage from './pages/HomePage';

const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ClientsPage = React.lazy(() => import('./pages/ClientsPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const TestimonialsPage = React.lazy(() => import('./pages/TestimonialsPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const targetId = extractHashTargetId(hash);
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = resolveScrollBehavior(prefersReduced);

    let cancelled = false;
    let rafId: number | null = null;
    let pollId: number | null = null;
    let startTimerId: number | null = null;

    const tryScrollToTarget = (): boolean => {
      if (cancelled) return true;
      const target = document.getElementById(targetId);
      if (!target) return false;
      rafId = window.requestAnimationFrame(() => {
        if (!cancelled) {
          target.scrollIntoView({ behavior, block: 'start' });
        }
      });
      return true;
    };

    // Immediate hit for in-page anchor clicks (e.g., #team while already on /about)
    if (!tryScrollToTarget()) {
      // Wait just past the 0.22s AnimatePresence mode="wait" exit transition before polling for mount
      let attempts = 0;
      startTimerId = window.setTimeout(() => {
        if (tryScrollToTarget()) return;
        pollId = window.setInterval(() => {
          attempts += 1;
          if (tryScrollToTarget() || attempts >= 20) {
            if (pollId !== null) {
              window.clearInterval(pollId);
              pollId = null;
            }
          }
        }, 40);
      }, 240);
    }

    return () => {
      cancelled = true;
      if (startTimerId !== null) window.clearTimeout(startTimerId);
      if (pollId !== null) window.clearInterval(pollId);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [pathname, hash]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const [toast, setToast] = useState<ToastState | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#18181B]">
      <SeoHead />
      <ScrollToTop />
      <ScrollProgress />
      <Navigation />

      <div className="flex-1 flex flex-col pt-16 pb-12 md:pb-0">
        <main id="main-content" className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <React.Suspense
                fallback={
                  <div className="min-h-[50vh] flex items-center justify-center py-20" aria-live="polite">
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-medium text-zinc-600">
                      <span className="w-2 h-2 rounded-full bg-[#C84B13] animate-ping" />
                      <span>Loading...</span>
                    </div>
                  </div>
                }
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/testimonials" element={<TestimonialsPage />} />
                  <Route path="/careers" element={<CareersPage onToast={setToast} />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/contact" element={<ContactPage onToast={setToast} />} />
                  <Route path="/admin" element={<AdminPage onToast={setToast} />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onToast={setToast} />
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <FirebaseProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </FirebaseProvider>
    </MotionConfig>
  );
}
