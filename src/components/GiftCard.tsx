import { useState, useEffect } from 'react';
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Gift } from '../types';
import { useAuth } from './AuthContext';
import { handleFirestoreError, OperationType } from '../lib/errorUtils';
import { Gift as GiftIcon, ExternalLink, Heart, Trash2, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getGuestUid, getGuestName, setGuestName as saveGuestName } from '../lib/guestUtils';

export function GiftCard({ gift }: { gift: Gift }) {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState(getGuestName());

  const guestUid = getGuestUid();
  const isReservedByMe = gift.status === 'reserved' && gift.reservedByUid === guestUid;
  const isAvailable = gift.status === 'available';

  const handleReserve = async () => {
    if (!nameInput.trim()) return;
    saveGuestName(nameInput.trim());
    
    setLoading(true);
    try {
      if (isAvailable) {
        await updateDoc(doc(db, 'gifts', gift.id), {
          status: 'reserved',
          reservedByUid: guestUid,
          reservedByName: nameInput.trim(),
          updatedAt: serverTimestamp()
        });
        setShowNameInput(false);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `gifts/${gift.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnreserve = async () => {
    setLoading(true);
    try {
      if (isReservedByMe || isAdmin) {
        await updateDoc(doc(db, 'gifts', gift.id), {
          status: 'available',
          reservedByUid: '',
          reservedByName: '',
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `gifts/${gift.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Точно удалить этот подарок?')) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'gifts', gift.id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gifts/${gift.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`relative group bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/60 shadow-xl shadow-pink-200/20 transition-all duration-300 flex flex-col h-full ${isAvailable ? 'hover:-translate-y-1 hover:shadow-pink-300/30' : 'opacity-80 hover:opacity-100'}`}
    >
      {/* Admin actions */}
      {isAdmin && (
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="absolute top-3 right-3 z-20 bg-white/70 backdrop-blur-sm p-2 rounded-full text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors shadow-sm"
          title="Удалить подарок"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-pink-50/50 flex items-center justify-center overflow-hidden shrink-0">
        {gift.imageUrl ? (
          <img 
            src={gift.imageUrl} 
            alt={gift.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <GiftIcon className="w-16 h-16 text-pink-200" />
        )}
        
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl text-pink-500 font-bold tracking-wide shadow-sm flex items-center gap-2 transform rotate-[-2deg]">
              <CheckCircle2 className="w-6 h-6 text-pink-400" />
              Забронировано
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 md:p-6 flex flex-col flex-1 relative">
        {/* Subtle decorative heart */}
        <Heart className="absolute bottom-4 right-4 w-24 h-24 text-pink-300/10 pointer-events-none" />

        <div className="flex-1">
          <h3 className="text-xl font-bold text-pink-900 leading-tight mb-2">
            {gift.title}
          </h3>

          {gift.url && (
            <a 
              href={gift.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-pink-100"
            >
              Где купить
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="pt-5 mt-4 border-t border-pink-100/50 relative z-10 shrink-0">
          {isAvailable ? (
            <AnimatePresence mode="wait">
              {showNameInput ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      className="w-full bg-white/80 border border-pink-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-900 placeholder:text-pink-300"
                      placeholder="Как вас зовут?..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleReserve()}
                      autoFocus
                    />
                    <button 
                      onClick={() => setShowNameInput(false)}
                      className="p-2 text-pink-400 hover:bg-pink-100 rounded-lg transition-colors shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleReserve}
                    disabled={loading || !nameInput.trim()}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                  >
                    Подтвердить <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowNameInput(true)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Я подарю это!
                </motion.button>
              )}
            </AnimatePresence>
          ) : isReservedByMe ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-pink-800 bg-pink-100/70 p-3 rounded-xl border border-pink-200/50 flex flex-col">
                <span className="text-xs text-pink-500 mb-1">Вы забронировали этот подарок</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ждем на празднике!</span>
              </p>
              <button
                onClick={handleUnreserve}
                disabled={loading}
                className="w-full bg-white/70 text-slate-500 hover:text-pink-500 hover:bg-white border border-pink-200/60 font-medium py-2 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
              >
                Отменить бронь
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-medium text-pink-600/80 bg-white/60 p-3 rounded-xl border border-pink-100">
                Забронировано: <strong className="text-pink-700 block mt-1">{gift.reservedByName || 'Хранится в секрете'}</strong>
              </div>
              {isAdmin && (
                <button
                  onClick={handleUnreserve}
                  disabled={loading}
                  className="w-full bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-200 font-medium py-1.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 text-xs"
                >
                  Снять бронь (Админ)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
