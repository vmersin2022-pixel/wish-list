/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { signInWithGoogle, logout } from './lib/firebase';
import { GiftList } from './components/GiftList';
import { AdminPanel } from './components/AdminPanel';
import { Sparkles, Heart } from 'lucide-react';

function WishlistApp() {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-pink-400 flex flex-col items-center gap-4">
          <Heart className="w-12 h-12 animate-bounce" fill="currentColor" />
          <p className="font-medium">Загружаем волшебство...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 text-slate-800 font-sans selection:bg-pink-300 selection:text-white">
      {/* Magical background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden text-pink-300/30 text-3xl sm:text-4xl">
        <div className="absolute top-[10%] left-[5%] animate-pulse rotate-12">🦄</div>
        <div className="absolute top-[20%] right-[10%] animate-[pulse_3s_ease-in-out_infinite] rotate-45">⭐</div>
        <div className="absolute bottom-[10%] left-[15%] animate-[pulse_4s_ease-in-out_infinite] -rotate-12">☁️</div>
        <div className="absolute top-[50%] right-[5%] animate-[pulse_5s_ease-in-out_infinite] -rotate-12">🦄</div>
        <div className="absolute bottom-[30%] right-[20%] animate-[pulse_2s_ease-in-out_infinite] rotate-12">💖</div>
        <div className="absolute top-[30%] left-[20%] animate-[pulse_4s_ease-in-out_infinite] rotate-12">✨</div>

        <div className="absolute top-10 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/30 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-pink-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 drop-shadow-sm flex items-center gap-3">
              Вишлист 🦄
            </h1>
            <Sparkles className="w-8 h-8 text-pink-400" />
          </div>
          <p className="text-pink-800/70 font-medium text-lg md:text-xl max-w-2xl mx-auto">
            Здесь собраны самые заветные желания ко дню рождения. Вы можете забронировать любой подарок!
          </p>
        </header>

        <main className="space-y-16">
          {isAdmin && (
            <section>
              <h2 className="text-2xl font-bold text-pink-800/80 mb-6 flex items-center gap-2">
                <span className="bg-pink-100 text-pink-500 p-2 rounded-xl"><Sparkles className="w-5 h-5" /></span>
                Для мамы (Управление)
              </h2>
              <AdminPanel />
            </section>
          )}

          <section>
            <GiftList />
          </section>
        </main>
        
        <footer className="mt-20 text-center pb-12 relative z-20">
          <button 
            onClick={user ? logout : signInWithGoogle}
            className="text-pink-300 hover:text-pink-500 transition-colors p-4 flex items-center justify-center w-full"
            title={user ? "Выйти" : "Вход для мамы"}
          >
            <Heart className="w-8 h-8 fill-current opacity-60 hover:opacity-100 transition-opacity drop-shadow-sm" />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistApp />
    </AuthProvider>
  );
}
