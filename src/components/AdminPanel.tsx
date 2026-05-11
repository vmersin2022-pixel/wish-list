import React, { useState } from 'react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/errorUtils';
import { Plus } from 'lucide-react';

export function AdminPanel() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const newGiftRef = doc(collection(db, 'gifts'));
      const giftData = {
        title: title.trim(),
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(url.trim() ? { url: url.trim() } : {}),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
      };

      await setDoc(newGiftRef, giftData);
      
      setTitle('');
      setUrl('');
      setImageUrl('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'gifts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/50 shadow-xl shadow-pink-200/20">
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-pink-800/80">Название подарка *</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-pink-900 placeholder:text-pink-300"
              placeholder="Мягкий мишка"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-pink-800/80">Ссылка на магазин</label>
            <input 
              type="url" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-pink-900 placeholder:text-pink-300"
              placeholder="https://wildberries.ru/..."
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-pink-800/80">Ссылка на картинку</label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full bg-white/70 border border-pink-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-pink-900 placeholder:text-pink-300"
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading || !title.trim()}
            className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            {loading ? "Добавляем..." : "Добавить в список"}
          </button>
        </div>
      </form>
    </div>
  );
}
