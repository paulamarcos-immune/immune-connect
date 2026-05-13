import React from 'react';

export default function ModalMusica({ musicaActivada, setMusicaActivada, setMostrarModalMusica }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#002e29] border border-emerald-400/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-emerald-400">Música de Fondo</h3>
        <p className="text-sm text-gray-300 mb-6">Música de concentración profunda para toda la aplicación.</p>
        
        <div className="flex flex-col gap-4 justify-center items-center">
          {musicaActivada ? (
            <button 
              onClick={() => { setMusicaActivada(false); setMostrarModalMusica(false); }} 
              className="w-full py-3 rounded-lg text-sm font-bold transition bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white uppercase tracking-widest"
            >
              ⏸ Pausar Música
            </button>
          ) : (
            <button 
              onClick={() => { setMusicaActivada(true); setMostrarModalMusica(false); }} 
              className="w-full py-3 rounded-lg text-sm font-bold transition bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] uppercase tracking-widest"
            >
              ▶️ Reproducir
            </button>
          )}
        </div>
        
        <button onClick={() => setMostrarModalMusica(false)} className="mt-6 text-xs text-gray-500 hover:text-white uppercase tracking-widest transition">Cerrar</button>
      </div>
    </div>
  );
}
