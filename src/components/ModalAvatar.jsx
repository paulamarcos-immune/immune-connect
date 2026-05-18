import React, { useState } from 'react';

// Nombres y códigos HEX validados para la API V9.x de Avataaars
const OPCIONES = {
  skinColor: [
    { id: "edb98a", colorHex: "#edb98a", label: "Clara" },
    { id: "d08b5b", colorHex: "#d08b5b", label: "Morena" },
    { id: "614335", colorHex: "#614335", label: "Oscura" },
    { id: "f8d25c", colorHex: "#f8d25c", label: "Amarilla" },
    { id: "3b82f6", colorHex: "#3b82f6", label: "Azul" }
  ],
  // Los ID ahora son códigos Hexadecimales puros (sin el #) para que la API no crashee
  hairColor: [
    { id: "2c1b18", colorHex: "#2c1b18", label: "Negro" },
    { id: "a55728", colorHex: "#a55728", label: "Castaño" },
    { id: "b94431", colorHex: "#b94431", label: "Pelirrojo" },
    { id: "e8e1e1", colorHex: "#e8e1e1", label: "Platino" },
    { id: "f59797", colorHex: "#f59797", label: "Rosa" },
    { id: "2a75b3", colorHex: "#2a75b3", label: "Azul" }
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
  // Aseguramos compatibilidad con cuentas antiguas y cargamos los valores por defecto
  const [localConfig, setLocalConfig] = useState({
    ...avatarConfig,
    facialHair: avatarConfig.facialHair || "blank",
    hairColor: avatarConfig.hairColor || avatarConfig.topColor || "2c1b18",
    facialHairColor: avatarConfig.facialHairColor || "2c1b18"
  });

  const handleCambio = (categoria, valor) => {
    setLocalConfig(prev => ({ ...prev, [categoria]: valor }));
  };

  // Función especial que pinta el pelo y la barba del mismo color a la vez
  const handleCambioColorPeloBarba = (colorId) => {
    setLocalConfig(prev => ({ 
      ...prev, 
      hairColor: colorId, 
      facialHairColor: colorId 
    }));
  };

  const guardarAvatar = () => {
    setAvatarConfig(localConfig);
    setMostrarModalAvatar(false);
  };

  const colorActualId = localConfig.hairColor;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#002e29] border border-emerald-400/30 p-6 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col md:flex-row gap-8 relative">
        
        <button onClick={() => setMostrarModalAvatar(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18"></path></svg>
        </button>

        {/* PREVIEW */}
        <div className="flex flex-col items-center justify-center bg-black/20 p-6 rounded-xl border border-white/5 w-full md:w-1/3 flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <img 
            src={getAvatarUrl(localConfig)} 
            className="w-32 h-32 rounded-full bg-gray-800 border-4 border-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)] object-cover relative z-10" 
            alt="Preview Avatar" 
          />
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs relative z-10">Tu Avatar</span>
        </div>

        {/* SELECTORES */}
        <div className="flex-1 space-y-5 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar">
          
          {/* COLOR PIEL */}
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Tono de Piel</span>
            <div className="flex flex-wrap gap-2.5">
              {OPCIONES.skinColor.map(opt => (
                <button 
                  key={opt.id} 
                  title={opt.label}
                  onClick={() => handleCambio('skinColor', opt.id)}
                  className={`w-9 h-9 rounded-full border-2 transition-all active:scale-95 ${localConfig.skinColor === opt.id ? 'border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-transparent hover:border-gray-500'}`}
                  style={{ backgroundColor: opt.colorHex }}
                />
              ))}
            </div>
          </div>

          {/* COLOR PELO Y BARBA */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Color de Pelo y Barba</span>
            <div className="flex flex-wrap gap-2.5">
              {OPCIONES.hairColor.map(opt => (
                <button 
                  key={opt.id} 
                  title={opt.label}
                  onClick={() => handleCambioColorPeloBarba(opt.id)}
                  className={`w-9 h-9 rounded-full border-2 transition-all active:scale-95 ${colorActualId === opt.id ? 'border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-transparent hover:border-gray-500'}`}
                  style={{ backgroundColor: opt.colorHex }}
                />
              ))}
            </div>
          </div>

          {/* ESTILO CABEZA */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Estilo de Pelo / Gorro</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.top.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('top', opt.id)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition active:scale-95 ${localConfig.top === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-700 text-gray-300 hover:border-emerald-400 hover:text-white'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ESTILO BARBA */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Estilo de Barba</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.facialHair.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('facialHair', opt.id)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition active:scale-95 ${localConfig.facialHair === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-700 text-gray-300 hover:border-emerald-400 hover:text-white'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* OJOS */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Expresión de Ojos</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.eyes.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('eyes', opt.id)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition active:scale-95 ${localConfig.eyes === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400 hover:text-white'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* BOCA */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Expresión de Boca</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.mouth.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('mouth', opt.id)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition active:scale-95 ${localConfig.mouth === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400 hover:text-white'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACCESORIOS */}
          <div className="pt-2 border-t border-white/5 mb-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 block font-bold">Accesorios</span>
            <div className="flex flex-wrap gap-2">
              {OPCIONES.accessories.map(opt => (
                <button key={opt.id} onClick={() => handleCambio('accessories', opt.id)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition active:scale-95 ${localConfig.accessories === opt.id ? 'bg-emerald-400 text-black border-emerald-400 font-bold' : 'border-gray-600 text-gray-300 hover:border-emerald-400 hover:text-white'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* BOTONES DE ACCIÓN */}
      <div className="fixed bottom-8 flex gap-4 z-50">
        <button onClick={() => setMostrarModalAvatar(false)} className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 transition uppercase tracking-widest backdrop-blur-sm border border-white/10">Cancelar</button>
        <button onClick={guardarAvatar} className="px-8 py-2.5 rounded-xl text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300 transition uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-500">Guardar</button>
      </div>
    </div>
  );
}
