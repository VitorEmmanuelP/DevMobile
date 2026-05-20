import { Timestamp } from 'firebase/firestore';

export type UserRole = 'aluno' | 'coordenador';

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
  createdAt: Timestamp;
};

export type PresenceStatus = 'vai' | 'nao_vai' | 'sem_resposta';

export type Presence = {
  userId: string;
  date: string; // YYYY-MM-DD
  status: PresenceStatus;
  updatedAt: Timestamp;
};

export type Ride = {
  creatorId: string;
  creatorName: string;
  date: string; // YYYY-MM-DD
  description: string;
  price: number | null;
  createdAt: Timestamp;
};
