import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Inbox,
  LogIn,
  LogOut,
  Mail,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { Button, SectionLabel, ToastState } from '../components/UiPrimitives';
import {
  CareerApplicationRecord,
  deleteSubmission,
  EnquiryRecord,
  NewsletterSubscriberRecord,
  subscribeCareerApplications,
  subscribeEnquiries,
  subscribeNewsletterSubscribers,
  updateSubmissionStatus,
} from '../services/firestoreService';
import {
  CAREER_STATUSES,
  ENQUIRY_STATUSES,
  isFirestoreQuotaError,
  NEWSLETTER_STATUSES,
} from '../utils/firestorePayloads';
import { firebaseAppConfig } from '../firebase';

type AdminTab = 'enquiries' | 'careers' | 'newsletter';

function formatTimestamp(ts?: Timestamp | null): string {
  if (!ts || typeof ts.toDate !== 'function') return 'Just now';
  return ts.toDate().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage({
  onToast,
}: {
  onToast: (toast: ToastState) => void;
}) {
  const { user, authReady, isAdmin, checkingAdmin, signIn, signOut } = useFirebase();
  const [activeTab, setActiveTab] = useState<AdminTab>('enquiries');
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [applications, setApplications] = useState<CareerApplicationRecord[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriberRecord[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setEnquiries([]);
      setApplications([]);
      setSubscribers([]);
      return;
    }

    const handleListenerError = (err: Error) => {
      if (isFirestoreQuotaError(err)) {
        setQuotaWarning(
          `Firestore free-tier quota exceeded. Quota resets tomorrow, or upgrade in the Firebase console (https://console.firebase.google.com/project/${firebaseAppConfig.projectId}/firestore/databases/${firebaseAppConfig.firestoreDatabaseId}/data?openUpgradeDialog=true).`,
        );
      } else {
        onToast({
          type: 'error',
          message: 'Unable to load records from Firestore.',
        });
      }
    };

    const unsubEnquiries = subscribeEnquiries(setEnquiries, handleListenerError);
    const unsubCareers = subscribeCareerApplications(setApplications, handleListenerError);
    const unsubNewsletter = subscribeNewsletterSubscribers(setSubscribers, handleListenerError);

    return () => {
      unsubEnquiries();
      unsubCareers();
      unsubNewsletter();
    };
  }, [authReady, user, isAdmin, onToast]);

  const handleSignIn = async () => {
    setAuthBusy(true);
    try {
      await signIn();
      onToast({ type: 'success', message: 'Signed in with Google.' });
    } catch {
      onToast({
        type: 'error',
        message: 'Google sign-in was cancelled or failed.',
      });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthBusy(true);
    try {
      await signOut();
      onToast({ type: 'success', message: 'Signed out.' });
    } finally {
      setAuthBusy(false);
    }
  };

  const handleStatusChange = async (
    collectionName: 'enquiries' | 'career_applications' | 'newsletter_subscribers',
    id: string,
    nextStatus: string,
  ) => {
    setBusyId(id);
    try {
      await updateSubmissionStatus(
        collectionName,
        id,
        nextStatus as EnquiryRecord['status'] &
          CareerApplicationRecord['status'] &
          NewsletterSubscriberRecord['status'],
      );
      onToast({ type: 'success', message: 'Status updated.' });
    } catch (error) {
      onToast({
        type: 'error',
        message: isFirestoreQuotaError(error)
          ? 'Firestore daily quota exceeded. Please try again tomorrow.'
          : 'Failed to update status.',
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (
    collectionName: 'enquiries' | 'career_applications' | 'newsletter_subscribers',
    id: string,
  ) => {
    setBusyId(id);
    try {
      await deleteSubmission(collectionName, id);
      onToast({ type: 'success', message: 'Record deleted.' });
    } catch (error) {
      onToast({
        type: 'error',
        message: isFirestoreQuotaError(error)
          ? 'Firestore daily quota exceeded. Please try again tomorrow.'
          : 'Failed to delete record.',
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <section className="bg-[#FAFAFA] dot-grid-light border-b border-zinc-200/80 pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <SectionLabel number="01" label="Studio Console" />
            <h1 className="font-display font-extrabold text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight text-[#09090B]">
              Submissions Inbox
            </h1>
            <p className="font-body text-base text-zinc-600 max-w-2xl">
              Review and triage project enquiries, career applications, and newsletter subscribers stored in Firestore.
            </p>
          </div>

          {authReady && user && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-body text-zinc-600 bg-white border border-zinc-200 rounded-xl px-3.5 py-2">
                Signed in as <strong className="text-[#09090B]">{user.email}</strong>
              </span>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSignOut}
                disabled={authBusy}
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Sign out</span>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {!authReady || checkingAdmin ? (
            <div className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-10 text-center">
              <p className="font-body text-sm text-zinc-600">Checking authentication status…</p>
            </div>
          ) : !user ? (
            <div className="max-w-lg mx-auto rounded-2xl border border-zinc-200 bg-white card-elevated p-8 text-center space-y-5">
              <div className="w-12 h-12 rounded-xl bg-[#C84B13]/10 text-[#C84B13] flex items-center justify-center mx-auto">
                <LogIn className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display font-bold text-2xl text-[#09090B]">
                  Admin Sign-In Required
                </h2>
                <p className="font-body text-sm text-zinc-600">
                  Sign in with an authorized Triratna Hi-Tech Google account to access enquiries, applications, and subscriber lists.
                </p>
              </div>
              <div className="pt-1 flex justify-center">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSignIn}
                  disabled={authBusy}
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>{authBusy ? 'Signing in…' : 'Sign in with Google'}</span>
                </Button>
              </div>
            </div>
          ) : !isAdmin ? (
            <div className="max-w-lg mx-auto rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#09090B]">
                Admin Access Restricted
              </h2>
              <p className="font-body text-sm text-zinc-700">
                Your account (<strong>{user.email}</strong>) is signed in, but only verified Triratna Hi-Tech administrators can read submitted client records.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {quotaWarning && (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-body text-amber-950"
                >
                  {quotaWarning}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-display font-semibold cursor-pointer transition-colors ${
                    activeTab === 'enquiries'
                      ? 'bg-[#09090B] text-white'
                      : 'bg-[#FAFAFA] text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <Inbox className="w-4 h-4" aria-hidden="true" />
                  <span>Enquiries ({enquiries.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('careers')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-display font-semibold cursor-pointer transition-colors ${
                    activeTab === 'careers'
                      ? 'bg-[#09090B] text-white'
                      : 'bg-[#FAFAFA] text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                  <span>Career Applications ({applications.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('newsletter')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-display font-semibold cursor-pointer transition-colors ${
                    activeTab === 'newsletter'
                      ? 'bg-[#09090B] text-white'
                      : 'bg-[#FAFAFA] text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Newsletter ({subscribers.length})</span>
                </button>
              </div>

              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  {enquiries.length === 0 ? (
                    <p className="font-body text-sm text-zinc-500 py-8">
                      No enquiries submitted yet.
                    </p>
                  ) : (
                    enquiries.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                      >
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-display font-bold text-lg text-[#09090B]">
                              {item.name}
                            </h3>
                            <a
                              href={`mailto:${item.email}`}
                              className="text-sm font-body text-[#0F4C5C] underline underline-offset-4"
                            >
                              {item.email}
                            </a>
                            <span className="text-xs font-body text-zinc-500">
                              {formatTimestamp(item.createdAt)} · via {item.sourcePath}
                            </span>
                          </div>
                          <p className="font-body text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                            {item.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <label htmlFor={`enq-status-${item.id}`} className="sr-only">
                            Status
                          </label>
                          <select
                            id={`enq-status-${item.id}`}
                            value={item.status}
                            disabled={busyId === item.id}
                            onChange={(e) =>
                              handleStatusChange('enquiries', item.id, e.target.value)
                            }
                            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-xs font-display font-semibold text-[#09090B]"
                          >
                            {ENQUIRY_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDelete('enquiries', item.id)}
                            disabled={busyId === item.id}
                            aria-label={`Delete enquiry from ${item.name}`}
                            className="h-10 w-10 rounded-xl border border-zinc-300 bg-white text-zinc-600 hover:text-red-600 hover:border-red-300 inline-flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'careers' && (
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <p className="font-body text-sm text-zinc-500 py-8">
                      No career applications submitted yet.
                    </p>
                  ) : (
                    applications.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] p-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                      >
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-display font-bold text-lg text-[#09090B]">
                              {item.name}
                            </h3>
                            <a
                              href={`mailto:${item.email}`}
                              className="text-sm font-body text-[#0F4C5C] underline underline-offset-4"
                            >
                              {item.email}
                            </a>
                            <span className="text-xs font-body text-zinc-500">
                              {formatTimestamp(item.createdAt)} · via {item.sourcePath}
                            </span>
                          </div>
                          <p className="font-body text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                            {item.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <label htmlFor={`car-status-${item.id}`} className="sr-only">
                            Status
                          </label>
                          <select
                            id={`car-status-${item.id}`}
                            value={item.status}
                            disabled={busyId === item.id}
                            onChange={(e) =>
                              handleStatusChange('career_applications', item.id, e.target.value)
                            }
                            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-xs font-display font-semibold text-[#09090B]"
                          >
                            {CAREER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDelete('career_applications', item.id)}
                            disabled={busyId === item.id}
                            aria-label={`Delete application from ${item.name}`}
                            className="h-10 w-10 rounded-xl border border-zinc-300 bg-white text-zinc-600 hover:text-red-600 hover:border-red-300 inline-flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'newsletter' && (
                <div className="space-y-3">
                  {subscribers.length === 0 ? (
                    <p className="font-body text-sm text-zinc-500 py-8">
                      No newsletter subscribers yet.
                    </p>
                  ) : (
                    subscribers.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-zinc-200 bg-[#FAFAFA] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-0.5">
                          <p className="font-display font-semibold text-sm text-[#09090B]">
                            {item.email}
                          </p>
                          <p className="font-body text-xs text-zinc-500">
                            {formatTimestamp(item.createdAt)} · via {item.sourcePath}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <label htmlFor={`news-status-${item.id}`} className="sr-only">
                            Status
                          </label>
                          <select
                            id={`news-status-${item.id}`}
                            value={item.status}
                            disabled={busyId === item.id}
                            onChange={(e) =>
                              handleStatusChange('newsletter_subscribers', item.id, e.target.value)
                            }
                            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-xs font-display font-semibold text-[#09090B]"
                          >
                            {NEWSLETTER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleDelete('newsletter_subscribers', item.id)}
                            disabled={busyId === item.id}
                            aria-label={`Delete subscriber ${item.email}`}
                            className="h-10 w-10 rounded-xl border border-zinc-300 bg-white text-zinc-600 hover:text-red-600 hover:border-red-300 inline-flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
