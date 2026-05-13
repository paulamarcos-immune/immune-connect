import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function VistaCafeteria({ nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) { 
  const [posicion, setPosicion] = useState({ x: 50, y: 50 });
  const [mesaCercana, setMesaCercana] = useState(null);
  const [mesaActiva, setMesaActiva] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [chatMesa, setChatMesa] = useState([]);
  const finalChatRef = useRef(null);

  const mesas = [
    { id: 1, nombre: "Mesa 1: Tomando un café ☕", desc: "Charla libre y desconexión.", x: 25, y: 75, color: "emerald" },
    { id: 2, nombre: "Mesa 2: Sala Pomodoro 🍅", desc: "50 min foco, 10 min descanso.", x: 75, y: 75, color: "cyan" }
  ];

  // Movimiento por el mapa
  useEffect(() => {
    if (mesaActiva !== null) return;
    const manejarTeclado = (e) => {
      const teclasMovimiento = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (teclasMovimiento.includes(e.key)) {
        e.preventDefault(); 
        const paso = 3; 
        setPosicion(prev => {
          let nuevaX = prev.x; let nuevaY = prev.y;
          if (e.key === 'ArrowUp') nuevaY = Math.max(5, prev.y - paso);
          if (e.key === 'ArrowDown') nuevaY = Math.min(95, prev.y + paso);
          if (e.key === 'ArrowLeft') nuevaX = Math.max(5, prev.x - paso);
          if (e.key === 'ArrowRight') nuevaX = Math.min(95, prev.x + paso);
          return { x: nuevaX, y: nuevaY };
        });
      }
      if (e.key === 'Enter' && mesaCercana !== null) setMesaActiva(mesaCercana);
    };
    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, [mesaActiva, mesaCercana]);

  // Detectar mesas cercanas
  useEffect(() => {
    let cerca = null;
    mesas.forEach(mesa => {
      if (Math.abs(posicion.x - mesa.x) < 15 && Math.abs(posicion.y - mesa.y) < 15) cerca = mesa.id;
    });
    setMesaCercana(cerca);
  }, [posicion]);

  // Cargar mensajes de la mesa activa
  useEffect(() => {
    if (mesaActiva === null) return;
    const q = query(collection(db, `cafeteria_mesa_${mesaActiva}`), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Revertimos para que los nuevos vayan abajo
      setChatMesa(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
    });
    return () => unsubscribe();
  }, [mesaActiva]);

  // Scroll automático al último mensaje
  useEffect(() => { 
    if (finalChatRef.current) {
      finalChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMesa]);

  // Enviar mensaje
  const enviarMensajeMesa = async (e) => {
    e.preventDefault();
    const textoLimpio = mensaje.trim();
    if (!textoLimpio || textoLimpio.length > 250 || mesaActiva === null) return; // Escudo activado aquí también
    
    await addDoc(collection(db, `cafeteria_mesa_${mesaActiva}`), {
      nombre: nombreUsuario, 
      texto: textoLimpio, 
      avatar: getAvatarUrl(avatarConfig), 
      fecha: serverTimestamp()
    });
    setMensaje("");
  };

  // Render 1: Sentados en la mesa (Vista del chat)
  if (mesaActiva !== null) {
    const mesaActual = mesas.find(m => m.id === mesaActiva);
    return (
      <div className="max-w-4xl mx-auto h-[650px] flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* CABECERA MESA */}
        <div className={`bg-${mesaActual.color}-400/10 border border-${mesaActual.color}-400/30 p-6 rounded-t-3xl flex justify-between items-center shrink-0`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-${mesaActual.color}-400/20 flex items-center justify-center text-2xl border border-${mesaActual.color}-400/50`}>
              {mesaActiva === 1 ? '☕' : '🍅'}
            </div>
            <div>
              <h2 className={`text-${mesaActual.color}-400 font-bold uppercase tracking-widest text-lg`}>{mesaActual.nombre}</h2>
              <p className="text-gray-400 text-sm">{mesaActual.desc}</p>
            </div>
          </div>
          <button 
            onClick={() => setMesaActiva(null)} 
            className={`border border-${mesaActual.color}-400 text-${mesaActual.color}-400 font-bold py-2 px-6 rounded-full text-xs uppercase tracking-widest hover:bg-${mesaActual.color}-400 hover:text-black transition`}
          >
            Levantarse
          </button>
        </div>

        {/* CHAT DE LA MESA */}
        <div className="bg-[#001a17] border-x border-b border-white/5 flex-1 flex flex-col overflow-hidden rounded-b-3xl shadow-2xl">
          
          {/* Contenedor de mensajes corregido: quitado el flex-col-reverse */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 custom-scrollbar">
            {chatMesa.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.nombre === nombreUsuario ? 'flex-row-reverse' : ''}`}>
                <img src={msg.avatar} alt="avatar" className={`w-8 h-8 rounded-full border border-${mesaActual.color}-400/50 bg-[#00241f]`} />
                <div className={`max-w-[70%] p-3 rounded-2xl shadow-md ${msg.nombre === nombreUsuario ? `bg-${mesaActual.color}-400/20 rounded-tr-none text-right border border-${mesaActual.color}-400/20` : 'bg-white/5 rounded-tl-none border border-white/5'}`}>
                  <h4 className={`font-bold text-[11px] uppercase tracking-wider mb-1 ${msg.nombre === nombreUsuario ? `text-${mesaActual.color}-400` : 'text-gray-400'}`}>{msg.nombre}</h4>
                  <p className="text-sm text-gray-200">{msg.texto}</p>
                </div>
              </div>
            ))}
            {chatMesa.length === 0 && <div className="text-center text-gray-500 text-sm mt-10">La mesa está vacía. ¡Rompe el hielo!</div>}
            
            {/* Div invisible para el scroll */}
            <div ref={finalChatRef}></div>
          </div>

          {/* INPUT */}
          <form onSubmit={enviarMensajeMesa} className="p-4 bg-black/20 border-t border-white/5 flex gap-3 shrink-0">
            <input 
              type="text" 
              value={mensaje} 
              onChange={(e) => setMensaje(e.target.value)} 
              placeholder="Habla con tu mesa..." 
              maxLength={250}
              className={`flex-1 bg-[#00241f] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-${mesaActual.color}-400 transition`} 
            />
            <button type="submit" className={`bg-${mesaActual.color}-400 text-black font-bold px-6 py-2 rounded-xl hover:opacity-90 transition uppercase text-xs tracking-widest`}>
              Enviar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render 2: Mapa 2D de la cafetería
  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-4">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setVistaActiva("clubs")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          ← Volver a Clubs
        </button>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-2xl mb-1">Cafetería Virtual</h2>
          <p className="text-gray-400 text-sm">Usa las <b>flechas del teclado</b> para moverte y acércate a una mesa.</p>
        </div>
        
        <div className="h-10">
          {mesaCercana !== null && (
            <button 
              onClick={() => setMesaActiva(mesaCercana)} 
              className="bg-emerald-400 text-black font-bold py-2 px-6 rounded-full text-sm uppercase tracking-widest animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            >
              [Enter] para sentarse
            </button>
          )}
        </div>
      </div>

      <div 
        className="relative w-full max-w-[600px] mx-auto aspect-square bg-[#001a17] rounded-3xl border-2 border-emerald-400/20 overflow-hidden shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('/cafeteria.png')" }} 
      >
        {mesas.map((mesa) => (
          <div key={mesa.id} className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-300 ${mesaCercana === mesa.id ? 'scale-110' : 'scale-100 opacity-80'}`} style={{ left: `${mesa.x}%`, top: `${mesa.y}%` }}>
            <div className={`w-20 h-20 rounded-full border-2 border-${mesa.color}-400/60 bg-${mesa.color}-400/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.4)]`}>
               <span className="text-2xl drop-shadow-md">{mesa.id === 1 ? '☕' : '🍅'}</span>
            </div>
            <div className="bg-black/70 px-2 py-1 rounded-md text-center mt-1">
              <h4 className={`text-[10px] font-bold text-${mesa.color}-400 uppercase tracking-wider`}>{mesa.nombre.split(':')[0]}</h4>
            </div>
          </div>
        ))}

        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-linear flex flex-col items-center gap-1 z-20" style={{ left: `${posicion.x}%`, top: `${posicion.y}%` }}>
          <div className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg mb-1">Tú</div>
          <img src={getAvatarUrl(avatarConfig)} alt="Mi Avatar" className={`w-12 h-12 rounded-full border-2 bg-gray-800 shadow-xl ${mesaCercana !== null ? 'border-emerald-400 scale-110' : 'border-white'}`} />
          <div className="w-6 h-1.5 bg-black/60 rounded-full blur-[2px] mt-1 shadow-inner"></div>
        </div>
      </div>
    </div>
  );
}

export default VistaCafeteria;
