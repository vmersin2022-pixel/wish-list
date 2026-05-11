import { Timestamp } from 'firebase/firestore';

export interface Gift {
  id: string;
  title: string;
  url?: string;
  imageUrl?: string;
  status: 'available' | 'reserved';
  reservedByUid?: string;
  reservedByName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
