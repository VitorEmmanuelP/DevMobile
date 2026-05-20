import { db } from '../config';
import {
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { Presence, PresenceStatus } from '../types';

export type { PresenceStatus, Presence };

export async function setPresence(
  userId: string,
  date: string,
  status: PresenceStatus
): Promise<void> {
  const id = `${userId}_${date}`;
  await setDoc(doc(db, 'presences', id), {
    userId,
    date,
    status,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToUserPresences(
  userId: string,
  dates: string[],
  callback: (presences: Record<string, PresenceStatus>) => void
): () => void {
  const q = query(
    collection(db, 'presences'),
    where('userId', '==', userId),
    where('date', 'in', dates)
  );
  return onSnapshot(q, (snapshot) => {
    const result: Record<string, PresenceStatus> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Presence;
      result[data.date] = data.status;
    });
    callback(result);
  });
}

export function subscribeToAllPresencesByDate(
  date: string,
  callback: (presences: Record<string, PresenceStatus>) => void
): () => void {
  const q = query(
    collection(db, 'presences'),
    where('date', '==', date)
  );
  return onSnapshot(q, (snapshot) => {
    const result: Record<string, PresenceStatus> = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Presence;
      result[data.userId] = data.status;
    });
    callback(result);
  });
}
