import React from 'react';

export default function VistaConnect({ setVistaActiva }) {
  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto space-y-6 pb-10 px-4">
      
      {/* Botón Volver */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("inicio")} className="text-gray-400 hover:text-white transition font-bold text-sm uppercase tracking-widest">
          &larr; Volver
        </button>
      </div>

      {/* Cabecera */}
      <div className="bg-gradient-to-b from-[#003d35] to-[#00241f] p-8 text-center rounded-3xl border border-emerald-400/20 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <h3 className="font-bold text-emerald-400 uppercase text-3xl mb-2 tracking-widest relative z-10">People Like You</h3>
        <p className="text-gray-300 text-sm tracking-widest relative z-10">Descubre tu casa y conecta con alumnos que comparten tu perfil tech.</p>
      </div>

      {/* ⚠️ CONTENEDOR DEL TEST (IFRAME) */}
      <div className="w-full bg-[#001a17] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative flex flex-col" style={{ height: '700px' }}>
        
        {/* Barra superior estilo navegador para darle un toque tech */}
        <div className="bg-black/40 py-3 px-4 flex items-center gap-2 border-b border-white/5">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
           </div>
           <div className="flex-1 text-center">
             <span className="bg-black/50 text-gray-500 text-[10px] uppercase tracking-widest px-4 py-1 rounded-full font-mono">
               immune-sorting-hat.exe
             </span>
           </div>
        </div>

        {/* Aquí llamamos a tu URL */}
        <iframe 
          src="https://test-de-las-casas.web.app/" 
          title="Test de las Casas IMMUNE"
          className="w-full flex-1 border-none bg-white" // Fondo blanco por si tu test lo necesita de base
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
}
