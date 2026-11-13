import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, OperationType, handleFirestoreError } from '../firebase';
import {
  buildCareerApplicationDraft,
  buildEnquiryDraft,
  buildNewsletterDraft,
  CareerStatus,
  EnquiryStatus,
  isBootstrapAdminEmail,
  isValidDocId,
  NewsletterStatus,
} from '../utils/firestorePayloads';

export interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  consent: boolean;
  status: EnquiryStatus;
  sourcePath: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface CareerApplicationRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  consent: boolean;
  status: CareerStatus;
  sourcePath: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface NewsletterSubscriberRecord {
  id: string;
  email: string;
  status: NewsletterStatus;
  sourcePath: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export type AdminCollectionName =
  | 'enquiries'
  | 'career_applications'
  | 'newsletter_subscribers';

export async function submitEnquiry(input: {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  sourcePath?: string;
}): Promise<string> {
  const path = 'enquiries';
  const draft = buildEnquiryDraft(input);
  try {
    const ref = await addDoc(collection(db, path), {
      ...draft,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function submitCareerApplication(input: {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  sourcePath?: string;
}): Promise<string> {
  const path = 'career_applications';
  const draft = buildCareerApplicationDraft(input);
  try {
    const ref = await addDoc(collection(db, path), {
      ...draft,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function subscribeNewsletter(input: {
  email: string;
  sourcePath?: string;
}): Promise<string> {
  const path = 'newsletter_subscribers';
  const draft = buildNewsletterDraft(input);
  try {
    const ref = await addDoc(collection(db, path), {
      ...draft,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function checkIsAdminUser(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) {
    return false;
  }
  if (isBootstrapAdminEmail(user.email, user.emailVerified)) {
    return true;
  }
  if (!isValidDocId(user.uid)) {
    return false;
  }
  const path = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    return snap.exists();
  } catch (error) {
    // Non-admins reading their own missing admin doc may receive permission-denied depending on rules;
    // return false cleanly unless unexpected.
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
      return false;
    }
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeEnquiries(
  onData: (items: EnquiryRecord[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const path = 'enquiries';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: EnquiryRecord[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<EnquiryRecord, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    },
  );
}

export function subscribeCareerApplications(
  onData: (items: CareerApplicationRecord[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const path = 'career_applications';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CareerApplicationRecord[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CareerApplicationRecord, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    },
  );
}

export function subscribeNewsletterSubscribers(
  onData: (items: NewsletterSubscriberRecord[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const path = 'newsletter_subscribers';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(200));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: NewsletterSubscriberRecord[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<NewsletterSubscriberRecord, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    },
  );
}

export async function updateSubmissionStatus(
  collectionName: AdminCollectionName,
  docId: string,
  status: EnquiryStatus | CareerStatus | NewsletterStatus,
): Promise<void> {
  if (!isValidDocId(docId)) {
    throw new Error('Invalid document ID.');
  }
  const path = `${collectionName}/${docId}`;
  try {
    await updateDoc(doc(db, collectionName, docId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSubmission(
  collectionName: AdminCollectionName,
  docId: string,
): Promise<void> {
  if (!isValidDocId(docId)) {
    throw new Error('Invalid document ID.');
  }
  const path = `${collectionName}/${docId}`;
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
