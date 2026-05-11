import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Gift } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorUtils';
import { GiftCard } from './GiftCard';

export function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gifts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const giftData: Gift[] = [];
      snapshot.forEach((doc) => {
        giftData.push({ id: doc.id, ...doc.data() } as Gift);
      });
      setGifts(giftData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'gifts');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/40 backdrop-blur-md rounded-3xl h-64 animate-pulse border border-white/50" />
        ))}
      </div>
    );
  }

  if (gifts.length === 0) {
    return (
      <div className="text-center py-12 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50">
        <p className="text-pink-800/60 font-medium">Пока нет желаний. Мама скоро добавит что-то волшебное! ✨</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {gifts.map(gift => (
        <GiftCard key={gift.id} gift={gift} />
      ))}
    </div>
  );
}
