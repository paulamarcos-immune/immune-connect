import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

function VistaForo({ categoria, nombreUsuario, avatarConfig, getAvatarUrl, setVistaActiva }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [tituloObra, setTituloObra] = useState("");

  const isCine = categoria === "cine";
  const colorTema = isCine ? "text-emerald-400" : "text-cyan-400";
  const bgTema = isCine ? "bg-emerald-400" : "bg-cyan-400";
  const borderTema = isCine ? "border-emerald-400" : "border-cyan-400";

  // DATOS DE EJEMPLO PARA LAS RECOMENDACIONES
  const recomendacionesCine = [
    { id: 1, titulo: "Interstellar", img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MvrId216.jpg" },
    { id: 2, titulo: "Breaking Bad", img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/ggFHVNu6YYI5L9pCfOacjizwpB.jpg" },
    { id: 3, titulo: "Mr. Robot", img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/oKIBdO5CGMN5OLCexXF8z5H1i08.jpg" },
    { id: 4, titulo: "The Matrix", img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
    { id: 5, titulo: "Oppenheimer", img: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" }
  ];

  const recomendacionesLectura = [
    { id: 1, titulo: "Hábitos Atómicos", img: "https://images.cdn2.buscalibre.com/fit-in/360x360/ce/55/ce5529f796a30d1d20037ebad6334651.jpg" },
    { id: 2, titulo: "Dune", img: "https://images.cdn3.buscalibre.com/fit-in/360x360/4c/a2/4ca28dcc1180fb7dd82a0b17b1897c84.jpg" },
    { id: 3, titulo: "1984", img: "https://images.cdn1.buscalibre.com/fit-in/360x360/6a/d2/6ad27818ebcc7c47b97cd3fecbc77583.jpg" },
    { id: 4, titulo: "El Problema de los 3 Cuerpos", img: "https://images.cdn1.buscalibre.com/fit-in/360x360/a6/50/a650dd7f40cfbd4eb692697858c278c7.jpg" },
    { id: 5, titulo: "Código Limpio", img: "https://images.cdn3.buscalibre.com/fit-in/360x360/d4/0b/d40bec6f905fbff54c46fce7c093a1c6.jpg" }
  ];

  useEffect(() => {
    const q = query(
      collection(db, "foro_cultura"), 
      where("categoria", "==", categoria)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    <section className="animate-in fade-in duration-300 flex flex-col gap-6">
      
      {/* CABECERA */}
      <div className="flex items-center gap-4">
        <button onClick={() => setVistaActiva("clubs")} className="text-gray-400 hover:text-white transition font-bold text-sm">
          &larr; Volver a Clubs
        </button>
        <h2 className={`${colorTema} font-bold uppercase tracking-widest text-sm`}>
          {isCine ? 'Foro de Cine y Series' : 'Club de Lectura'}
        </h2>
      </div>

      {/* CARRUSEL DE RECOMENDACIONES VISUALES */}
      <div className="bg-[#002e29]/50 p-6 rounded-2xl border border-white/10 shadow-lg overflow-hidden">
        <h3 className="text-xs text-white uppercase font-bold tracking-widest mb-4">
          Destacados de la semana
        </h3>
        
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar snap-x">
          
          {isCine ? (
            /* EFECTO PÓSTERS DE CINE (Zoom + Brillo) */
            recomendacionesCine.map((peli) => (
              <div 
                key={peli.id} 
                className="relative w-36 h-52 shrink-0 snap-center rounded-xl overflow-hidden shadow-xl hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer group border border-white/5"
                onClick={() => setTituloObra(peli.titulo)} // Al hacer clic, autocompleta el formulario
              >
                <img src={peli.img} className="w-full h-full object-cover" alt={peli.titulo} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                  <span className="text-[10px] text-white font-bold text-center leading-tight drop-shadow-md">{peli.titulo}</span>
                </div>
              </div>
            ))
          ) : (
            /* EFECTO BIBLIOTECA 3D (Levanta el libro y gira) */
            recomendacionesLectura.map((libro) => (
              <div 
                key={libro.id} 
                className="relative w-32 h-48 shrink-0 snap-center rounded-r-xl border-l-[6px] border-[#1a1a1a] shadow-[8px_8px_15px_rgba(0,0,0,0.6)] hover:-translate-y-4 hover:rotate-3 hover:shadow-[15px_15px_20px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer bg-white"
                onClick={() => setTituloObra(libro.titulo)}
              >
                <img src={libro.img} className="w-full h-full object-cover rounded-r-lg opacity-90 hover:opacity-100 transition-opacity" alt={libro.titulo} />
                {/* Sombreado interno para simular la tapa del libro */}
                <div className="absolute inset-0 rounded-r-lg shadow-[inset_4px_0_10px_rgba(255,255,255,0.2)]"></div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ÁREA DE FORO */}
      <div className="bg-[#002e29] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <form onSubmit={enviarMensaje} className="p-5 bg-black/20 border-b border-gray-800 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1 block">¿De qué obra vas a hablar?</label>
            <input 
              type="text" 
              value={tituloObra} 
              onChange={(e) => setTituloObra(e.target.value)} 
              placeholder={isCine ? "Haz clic en un póster o escribe un título..." : "Haz clic en un libro o escribe un título..."} 
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
              <button type="submit" className={`${bgTema} text-black font-bold px-6 py-2 rounded-lg hover:opacity-80 transition uppercase text-xs tracking-wider`}>
                Publicar
              </button>
            </div>
          </div>
        </form>

        <div className="h-[400px] overflow-y-auto divide-y divide-gray-800 flex flex-col custom-scrollbar">
          {mensajes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <p className="text-sm">Aún no hay reseñas. ¡Sé el primero en comentar!</p>
            </div>
          ) : (
            mensajes.map((msg) => (
              <div key={msg.id} className="p-5 flex gap-4 hover:bg-white/5 transition">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex-shrink-0 border border-white/10 overflow-hidden mt-1">
                  <img src={msg.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-white">{msg.nombre}</h4>
                  </div>
                  <span className={`inline-block mt-1 mb-2 text-[10px] font-bold px-3 py-1 rounded-full bg-white/10 ${colorTema} border border-white/5 shadow-sm`}>
                    {isCine ? '🎬' : '📖'} {msg.obra}
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
