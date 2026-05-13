import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

function VistaForo({ categoria, nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [tituloObra, setTituloObra] = useState("");

  // Ajustamos estilos según si es cine o lectura
  const isCine = categoria === "cine";
  const colorTema = isCine ? "text-emerald-400" : "text-cyan-400";
  const bgTema = isCine ? "bg-emerald-400" : "bg-cyan-400";
  const borderTema = isCine ? "border-emerald-400" : "border-cyan-400";

  useEffect(() => {
    // Solo traemos los mensajes de la categoría actual (cine o lectura)
    const q = query(
      collection(db, "foro_cultura"), 
      where("categoria", "==", categoria)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenamos localmente por fecha (de más nuevo a más viejo)
      docs.sort((a, b) => (b.fecha?.toMillis() || 0) - (a.fecha?.toMillis() || 0));
      setMensajes(docs);
    });
    return () => unsubscribe();
  }, [categoria]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !tituloObra.trim()) return;
    
    await addDoc(collection(db, "foro_cultura"), {
      nombre: nombreUsuario,
      categoria: categoria,
      obra: tituloObra,
      texto: nuevoMensaje,
      avatar: getAvatarUrl(avatarConfig),
      fecha: serverTimestamp()
    });
    
    setNuevoMensaje("");
    setTituloObra("");
  };

  return (
    <section className="animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        {/* AQUI ESTÁ EL CAMBIO: Ahora vuelve a "clubs" en lugar de "inicio" */}
        <button onClick={() => setVistaActiva("clubs")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Clubs
        </button>
        <h2 className={`${colorTema} font-bold uppercase tracking-widest text-sm`}>
          Foro Abierto: {isCine ? 'Cine y Series' : 'Lectura'}
        </h2>
      </div>

      <div className="bg-[#002e29] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Formulario de Reseñas */}
        <form onSubmit={enviarMensaje} className="p-5 bg-black/20 border-b border-gray-800 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 block">¿De qué obra vas a hablar?</label>
            <input 
              type="text" 
              value={tituloObra} 
              onChange={(e) => setTituloObra(e.target.value)} 
              placeholder={isCine ? "Ej: Interstellar, Breaking Bad..." : "Ej: Dune, Hábitos Atómicos..."} 
              className={`w-full bg-[#001a17] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:${borderTema} transition`} 
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 block">Tu reseña / opinión</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={nuevoMensaje} 
                onChange={(e) => setNuevoMensaje(e.target.value)} 
                placeholder="Escribe tu opinión aquí..." 
                className={`flex-1 bg-[#001a17] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:${borderTema} transition`} 
                required
              />
              <button type="submit" className={`${bgTema} text-black font-bold px-6 py-2 rounded-lg hover:opacity-80 transition uppercase text-xs`}>
                Publicar
              </button>
            </div>
          </div>
        </form>

        {/* Muro del Foro */}
        <div className="h-[400px] overflow-y-auto divide-y divide-gray-800 flex flex-col">
          {mensajes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              <p className="text-sm">Aún no hay reseñas. ¡Sé el primero en comentar!</p>
            </div>
          ) : (
            mensajes.map((msg) => (
              <div key={msg.id} className="p-5 flex gap-4 hover:bg-white/5 transition">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0 border border-white/10 overflow-hidden mt-1">
                  <img src={msg.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-white">{msg.nombre}</h4>
                  </div>
                  <span className={`inline-block mt-1 mb-2 text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 ${colorTema} border border-white/5 shadow-sm`}>
                    🎬 {msg.obra}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">{msg.texto}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default VistaForo;
