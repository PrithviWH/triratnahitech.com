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

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ClientsPage from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
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
                <Route path="*" element={<HomePage />} />
              </Routes>
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
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </MotionConfig>
  );
}
