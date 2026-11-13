import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { SITE_INFO } from '../data/siteData';
import { LeadFormErrors, validateLeadForm } from '../utils/siteLogic';
import { isFirestoreQuotaError } from '../utils/firestorePayloads';
import { submitEnquiry } from '../services/firestoreService';
import { Button, SectionLabel, ToastState } from '../components/UiPrimitives';
import { ConsentCheckbox, FormField } from '../components/FormField';

export default function ContactPage({
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
      await submitEnquiry({
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
        message: 'Message sent! Our Pune team will respond shortly.',
      });
    } catch (error) {
      onToast({
        type: 'error',
        message: isFirestoreQuotaError(error)
          ? 'Daily storage quota reached. Please call or WhatsApp our Pune team directly.'
          : 'Could not save your enquiry right now. Please try again or message us on WhatsApp.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <SectionLabel number="01" label="Contact" />
            <h1 className="font-display font-extrabold text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[#09090B]">
              Let&apos;s Talk
            </h1>
            <p className="font-body text-lg sm:text-xl text-zinc-600 max-w-2xl">
              Tell us what you&apos;re building; call {SITE_INFO.phoneShort} and let&apos;s plan.
            </p>
          </div>
          <div className="lg:col-span-4 rounded-2xl border border-zinc-200 bg-white p-5 space-y-1.5 text-sm text-zinc-700 card-elevated">
            <p>
              <span className="text-zinc-500">Email:</span> {SITE_INFO.email}
            </p>
            <p>
              <span className="text-zinc-500">Phone:</span> {SITE_INFO.phoneDisplay}
            </p>
            <p>
              <span className="text-zinc-500">Address:</span> {SITE_INFO.address}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white card-elevated p-7 sm:p-10">
            <SectionLabel number="02" label="Send a Message" />
            <h2 className="font-display font-bold text-3xl tracking-tight text-[#09090B] mb-6">
              Project Enquiry
            </h2>

            {submitted ? (
              <div className="space-y-6">
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" aria-hidden="true" />
                    <h3 className="font-display font-bold text-xl text-[#09090B]">
                      Thank you for reaching out
                    </h3>
                  </div>
                  <p className="font-body text-base text-zinc-700">
                    We have received your message and will get back to you from our Pune office.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold underline underline-offset-4 text-[#09090B] cursor-pointer"
                  >
                    Send another enquiry
                  </button>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-[#FAFAFA] p-6 space-y-2">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-[#0F4C5C]">
                    Need Immediate Assistance?
                  </p>
                  <p className="font-body text-sm text-zinc-600">
                    Call our Pune team directly between {SITE_INFO.hours} on{' '}
                    <a
                      href={`tel:${SITE_INFO.phoneRaw}`}
                      className="font-semibold underline underline-offset-4 text-[#09090B]"
                    >
                      {SITE_INFO.phoneDisplay}
                    </a>{' '}
                    or message us on WhatsApp.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <FormField
                  label="Name"
                  name="contact-name"
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
                  name="contact-email"
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
                  name="contact-message"
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
                  <span>{submitting ? 'Sending…' : 'Send Message'}</span>
                </Button>
              </form>
            )}
          </div>

          {/* Visit Us + Embedded Google Map */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <SectionLabel number="03" label="Pune Office" />
              <h2 className="font-display font-bold text-3xl tracking-tight text-[#09090B]">
                Visit Us
              </h2>
              <p className="font-body text-base text-zinc-600 mt-2">
                Reach our Pune team for practical digital support.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-[#FAFAFA] divide-y divide-zinc-200 card-elevated">
              <a
                href={`tel:${SITE_INFO.phoneRaw}`}
                className="flex items-center gap-4 p-4 hover:bg-white transition-colors"
              >
                <Phone className="w-5 h-5 text-[#C84B13] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Call Us
                  </p>
                  <p className="font-display font-semibold text-base text-[#09090B]">
                    {SITE_INFO.phoneDisplay}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${SITE_INFO.email}`}
                className="flex items-center gap-4 p-4 hover:bg-white transition-colors"
              >
                <Mail className="w-5 h-5 text-[#0F4C5C] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Email Us
                  </p>
                  <p className="font-display font-semibold text-base text-[#09090B] break-all">
                    {SITE_INFO.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4">
                <Clock className="w-5 h-5 text-zinc-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Hours
                  </p>
                  <p className="font-display font-semibold text-base text-[#09090B]">
                    {SITE_INFO.hours}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4">
                <MapPin className="w-5 h-5 text-[#C84B13] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Address
                  </p>
                  <p className="font-display font-semibold text-base text-[#09090B]">
                    {SITE_INFO.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden card-elevated">
              <iframe
                title="Triratna Hi-Tech Location Map — Charholi Kh. Pune"
                src={SITE_INFO.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-64 border-0"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-[#09090B]">
              Let&apos;s Talk
            </h2>
            <p className="font-body text-lg text-zinc-600 max-w-2xl">
              Ready to grow your business? Talk with our Pune team about websites, digital marketing, and the right next steps.
            </p>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <Button href={`tel:${SITE_INFO.phoneRaw}`} variant="primary" magnetic>
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Call</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
