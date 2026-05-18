import React, { useState } from 'react';

// Nombres estrictamente validados para la API V9.x de Avataaars
const OPCIONES = {
  skinColor: [
    { id: "edb98a", color: "#edb98a" }, // Clara
    { id: "d08b5b", color: "#d08b5b" }, // Morena
    { id: "614335", color: "#614335" }, // Oscura
    { id: "f8d25c", color: "#f8d25c" }, // Amarilla
    { id: "3b82f6", color: "#3b82f6" }  // Azul
  ],
  top: [
    { id: "none", label: "Calvo" },
    { id: "shortFlat", label: "Pelo Corto" },
    { id: "straight01", label: "Pelo Largo" },
    { id: "dreads", label: "Rastas" },
    { id: "winterHat1", label: "Gorro" },
    { id: "hijab", label: "Hijab" }
  ],
  eyes: [
    { id: "closed", label: "Cerrados" },
    { id: "default", label: "Normales" },
    { id: "happy", label: "Felices" },
    { id: "wink", label: "Guiño" },
    { id: "surprised", label: "Sorpresa" }
  ],
  mouth: [
    { id: "serious", label: "Serio" },
    { id: "smile", label: "Sonrisa" },
    { id: "tongue", label: "Lengua" },
    { id: "sad", label: "Triste" }
  ],
  accessories: [
    { id: "blank", label: "Ninguno" },
    { id: "prescription01", label: "Gafas de ver" },
    { id: "sunglasses", label: "Gafas de sol" },
    { id: "kurt", label: "Gafas Kurt" }
  ],
  facialHair: [
    { id: "blank", label: "Ninguna" },
    { id: "beardLight", label: "Barba Corta" },
    { id: "beardMajestic", label: "Barba Larga" }
  ]
};

export default function ModalAvatar({ avatarConfig, setAvatarConfig, setMostrarModalAvatar, getAvatarUrl }) {
  // Nos aseguramos de que si el usuario es antiguo y no tenía el campo facialHair, empiece en "blank"
  const [localConfig, setLocalConfig] = useState({
    ...avatarConfig,
    facialHair: avatarConfig.facialHair || "blank"
  });

  const handleCambio = (categoria, valor) => {
    setLocalConfig(prev => ({ ...prev, [categoria]: valor }));
  };

  const guardarAvatar = () => {
    setAvatarConfig(localConfig);
    setMostrarModalAvatar(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#002e29] border border-emerald-400/30 p-6 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col md:flex-row gap-8">
        
        <div className="flex flex-col items-center justify-center bg-black/20 p-6 rounded-xl border border-white/5 w-full md:w-1/3">
          <img 
            src={getAvatarUrl(localConfig)} 
            className="w-32 h-32 rounded-full bg-gray-800 border-4 border-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)] object-cover" 
            alt="Preview Avatar" 
          />
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Tu Avatar</span>
        </div>

        <div className="flex-1 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Piel</span>
            <div className="flex gap-2">
              {OPCIONES.skinColor.map(opt => (
                <button 
                  key={opt.id} 
                  onClick={() => handleCambio('skinColor', opt.id)}
                  className={`w-8 h-8 rounded-full border-2 transition ${localConfig.skinColor === opt.id ? 'border-emerald-400 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: opt.color }}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Cabeza</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.top.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('top', opt.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${localConfig.top === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Barba</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.facialHair.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('facialHair', opt.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${localConfig.facialHair === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Ojos</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.eyes.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('eyes', opt.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${localConfig.eyes === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Boca</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.mouth.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('mouth', opt.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${localConfig.mouth === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Accesorios</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.accessories.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('accessories', opt.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${localConfig.accessories === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      <div className="fixed bottom-10 flex gap-4">
        <button onClick={() => setMostrarModalAvatar(false)} className="px-6 py-2 rounded-lg text-sm font-bold bg-white/10 hover:bg-white/20 transition uppercase tracking-widest backdrop-blur-sm">Cancelar</button>
        <button onClick={guardarAvatar} className="px-6 py-2 rounded-lg text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300 transition uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.5)]">Guardar Avatar</button>
      </div>
    </div>
  );
}
