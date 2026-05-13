import React from 'react';

export default function ModalMusica({ musicaActivada, setMusicaActivada, setMostrarModalMusica }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#002e29] border border-emerald-400/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-emerald-400">Volumen / Música</h3>
        <p className="text-sm text-gray-300 mb-6">¿Quieres escuchar la música de fondo de la aplicación?</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => { setMusicaActivada(true); setMostrarModalMusica(false); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${musicaActivada ? "bg-emerald-500 text-white" : "bg-white/10 hover:bg-white/20"}`}>Activar</button>
          <button onClick={() => { setMusicaActivada(false); setMostrarModalMusica(false); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${!musicaActivada ? "bg-red-500 text-white" : "bg-white/10 hover:bg-white/20"}`}>Desactivar</button>
        </div>
        <button onClick={() => setMostrarModalMusica(false)} className="mt-8 text-xs text-gray-500 hover:text-white uppercase tracking-widest">Cerrar</button>
      </div>
    </div>
  );
}