import React, { useState } from 'react';

export default function ModalNombre({ nombreActual, setNombreUsuario, setMostrarModalNombre }) {
  const [nuevoNombre, setNuevoNombre] = useState(nombreActual);

  const guardarNombre = () => {
    if (nuevoNombre.trim()) {
      setNombreUsuario(nuevoNombre.trim());
    }
    setMostrarModalNombre(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#002e29] border border-emerald-400/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-emerald-400">Cambiar Nombre</h3>
        <input 
          type="text" 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="w-full bg-[#001a17] border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-400 text-center mb-6"
          placeholder="Escribe tu nombre..."
        />
        <div className="flex justify-center gap-4">
          <button onClick={() => setMostrarModalNombre(false)} className="px-6 py-2 rounded-lg text-sm font-bold bg-white/10 hover:bg-white/20 transition">Cancelar</button>
          <button onClick={guardarNombre} className="px-6 py-2 rounded-lg text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300 transition">Aceptar</button>
        </div>
      </div>
    </div>
  );
}