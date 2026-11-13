import React, { useState } from 'react';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { OPEN_ROLES, SITE_INFO } from '../data/siteData';
import { LeadFormErrors, validateLeadForm } from '../utils/siteLogic';
import { isFirestoreQuotaError } from '../utils/firestorePayloads';
import { submitCareerApplication } from '../services/firestoreService';
import {
  Button,
  ChamferCard,
  SectionLabel,
  ToastState,
} from '../components/UiPrimitives';
import { ConsentCheckbox, FormField } from '../components/FormField';
import { GemMarker } from '../components/GemMotif';

export default function CareersPage({
  onToast,
}: {
  onToast: (toast: ToastState) => void;
}) {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLeadForm({ name, email, message, consent });
    if (!result.isValid) {
      setErrors(result.errors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await submitCareerApplication({
        name,
        email,
        message,
        consent,
        sourcePath: location.pathname,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setConsent(false);
      onToast({
        type: 'success',
        message: 'Application details received! Our team will review and reach out.',
      });
    } catch (error) {
      onToast({
        type: 'error',
        message: isFirestoreQuotaError(error)
          ? 'Daily storage quota reached. Please email your application to triratnahitech@gmail.com.'
          : 'Could not submit your application right now. Please try again shortly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <SectionLabel number="01" label="Careers" />
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
              Grow With Us
            </h1>
            <p className="font-body text-lg sm:text-xl leading-relaxed text-zinc-600 max-w-2xl">
              At Triratna Hi-Tech, we bring 6+ years of digital expertise to help businesses grow - and give curious, collaborative people room to learn, contribute, and thrive.
            </p>
            <div>
              <Button href="#open-roles" variant="primary" magnetic>
                <span>View Roles</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#09090B] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <p className="font-display font-semibold text-2xl sm:text-3xl leading-snug text-zinc-100">
              Bring your ideas to Triratna Hi-Tech and help businesses grow through thoughtful digital marketing, web development, and technology.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button href="#career-form" variant="dark">
              <span>Apply</span>
            </Button>
          </div>
        </div>
      </section>

      <section id="open-roles" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <SectionLabel number="02" label="Openings" />
            <h2 className="font-display font-bold text-3xl tracking-tight text-[#09090B]">
              View Roles
            </h2>

            {OPEN_ROLES.length === 0 ? (
              <ChamferCard surface="cream" className="p-7 space-y-4">
                <div className="flex items-center gap-2">
                  <GemMarker size={8} color="#C84B13" />
                  <span className="font-display text-xs font-semibold uppercase tracking-wider text-[#0F4C5C]">
                    Openings Status
                  </span>
                </div>
                <p className="font-display font-bold text-xl text-[#09090B]">
                  No open roles listed right now - send us your details
                </p>
                <p className="font-body text-sm text-zinc-600 leading-relaxed">
                  Share your interest using the Start Your Career form and our Pune team will keep your profile on file.
                </p>
              </ChamferCard>
            ) : (
              <ul className="space-y-4">
                {OPEN_ROLES.map((role) => (
                  <li
                    key={role.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 card-elevated"
                  >
                    <h3 className="font-display font-bold text-lg">{role.title}</h3>
                    <p className="text-xs font-medium text-[#0F4C5C] mt-1">
                      {role.location} · {role.type}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div id="career-form" className="lg:col-span-7 scroll-mt-20">
            <div className="rounded-2xl border border-zinc-200 bg-white card-elevated p-7 sm:p-10">
              <SectionLabel number="03" label="Application" />
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[#09090B] mb-6">
                Start Your Career
              </h2>

              {submitted ? (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" aria-hidden="true" />
                    <h3 className="font-display font-bold text-xl text-[#09090B]">
                      Thank you for applying
                    </h3>
                  </div>
                  <p className="font-body text-base text-zinc-700">
                    Your details have been received by {SITE_INFO.name}. We will contact you if there is a suitable opportunity.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold underline underline-offset-4 text-[#09090B] cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <FormField
                    label="Name"
                    name="career-name"
                    value={name}
                    onChange={(val) => {
                      setName(val);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    error={errors.name}
                    required
                  />
                  <FormField
                    label="Email"
                    name="career-email"
                    type="email"
                    value={email}
                    onChange={(val) => {
                      setEmail(val);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    error={errors.email}
                    required
                  />
                  <FormField
                    label="Message"
                    name="career-message"
                    type="textarea"
                    value={message}
                    onChange={(val) => {
                      setMessage(val);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    error={errors.message}
                    required
                  />
                  <ConsentCheckbox
                    checked={consent}
                    onChange={(checked) => {
                      setConsent(checked);
                      if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
                    }}
                    label={SITE_INFO.consentText}
                    error={errors.consent}
                  />
                  <Button type="submit" variant="primary" magnetic disabled={submitting}>
                    <span>{submitting ? 'Submitting…' : 'Submit Application'}</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
