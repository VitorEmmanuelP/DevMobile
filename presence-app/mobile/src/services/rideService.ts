import { db } from '../config';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { Ride } from '../types';

export type NewRide = Omit<Ride, 'createdAt'>;

export async function createRide(data: NewRide): Promise<string> {
  const ref = await addDoc(collection(db, 'rides'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteRide(rideId: string): Promise<void> {
  await deleteDoc(doc(db, 'rides', rideId));
}

export function subscribeToRidesByDate(
  date: string,
  callback: (rides: (Ride & { id: string })[]) => void
): () => void {
  const q = query(collection(db, 'rides'), where('date', '==', date));
  return onSnapshot(q, (snapshot) => {
    const rides = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Ride),
    }));
    callback(rides);
  });
}
