import { db } from '../config';
import { collection, doc, getDoc, onSnapshot, query, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { AppUser } from '../types';

export function subscribeToUserProfile(
  uid: string,
  callback: (user: AppUser | null) => void
): () => void {
  return onSnapshot(doc(db, 'users', uid), (docSnap) => {
    if (docSnap.exists()) {
      callback({ uid: docSnap.id, ...docSnap.data() } as AppUser);
    } else {
      callback(null);
    }
  });
}

export function subscribeToAllUsers(
  callback: (users: AppUser[]) => void
): () => void {
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    const users: AppUser[] = [];
    snapshot.forEach((docSnap) => {
      users.push({ uid: docSnap.id, ...docSnap.data() } as AppUser);
    });
    callback(users);
  });
}

/**
 * Garante que o documento do usuário existe no Firestore.
 * Se já existir (criado pelo coordenador), não sobrescreve.
 * Se não existir, cria com dados básicos do Firebase Auth.
 */
export async function ensureUserProfile(firebaseUser: User): Promise<void> {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      name: firebaseUser.displayName ?? firebaseUser.email ?? 'Aluno',
      email: firebaseUser.email ?? '',
      photoUrl: firebaseUser.photoURL ?? '',
      role: 'aluno',
      createdAt: serverTimestamp(),
    });
  }
}
