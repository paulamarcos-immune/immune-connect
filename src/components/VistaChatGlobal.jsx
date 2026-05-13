import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

function VistaChatGlobal({ nombreUsuario, paisUsuario, banderaActual, avatarConfig, getAvatarUrl, isWidget }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [mensajeRespondiendo, setMensajeRespondiendo] = useState(null);
  const [mostrarStickers, setMostrarStickers] = useState(false);
  const finalChatRef = useRef(null);

  // Colección de GIFs/Stickers predefinidos
  const stickers = [
    "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif", // Programando rápido
    "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",     // Hacker
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",      // Gato tecleando
    "https://media.giphy.com/media/3oKIPnAiaCRIGQCZtC/giphy.gif", // Mente volada
    "https://media.giphy.com/media/26tn33aiTi1jIGsO4/giphy.gif",  // OK
    "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif"   // Celebración
  ];

  // 1. Cargar mensajes en tiempo real
  useEffect(() => {
    const q = query(collection(db, "chat_global"), orderBy("fecha", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Revertimos el orden para que los más nuevos salgan abajo
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
      setMensajes(docs);
    });
    return () => unsubscribe();
  }, []);

  // 2. Hacer scroll automático hacia abajo al recibir un mensaje
  useEffect(() => {
    if (finalChatRef.current) {
      finalChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  // 3. Enviar mensaje de texto
  const enviarMensaje = async (e) => {
    if (e) e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    await addDoc(collection(db, "chat_global"), {
      nombre: nombreUsuario,
      pais: paisUsuario,
      bandera: banderaActual,
      avatar: getAvatarUrl(avatarConfig),
      texto: nuevoMensaje,
      fecha: serverTimestamp(),
      likes: [], // Array vacío para empezar
      // Si estamos respondiendo a alguien, guardamos su nombre y su texto
      respuestaA: mensajeRespondiendo ? { nombre: mensajeRespondiendo.nombre, texto: mensajeRespondiendo.texto } : null
    });

    setNuevoMensaje("");
    setMensajeRespondiendo(null);
  };

  // 4. Enviar un Sticker/GIF
  const enviarSticker = async (url) => {
    await addDoc(collection(db, "chat_global"), {
      nombre: nombreUsuario,
      pais: paisUsuario,
      bandera: banderaActual,
      avatar: getAvatarUrl(avatarConfig),
      texto: "", // Sin texto
      imagenUrl: url, // Añadimos la URL de la imagen
      fecha: serverTimestamp(),
      likes: [],
      respuestaA: mensajeRespondiendo ? { nombre: mensajeRespondiendo.nombre, texto: mensajeRespondiendo.texto } : null
    });
    setMostrarStickers(false);
    setMensajeRespondiendo(null);
  };

  // 5. Dar o quitar Like a un mensaje
  const toggleLike = async (idMensaje, likesActuales = []) => {
    const docRef = doc(db, "chat_global", idMensaje);
    let nuevosLikes = [...likesActuales];
    
    if (nuevosLikes.includes(nombreUsuario)) {
      // Si ya le dio like, se lo quitamos
      nuevosLikes = nuevosLikes.filter(n => n !== nombreUsuario);
    } else {
      // Si no, lo añadimos
      nuevosLikes.push(nombreUsuario);
    }
    
    await updateDoc(docRef, { likes: nuevosLikes });
  };

  return (
    <div className={`bg-[#001a17]/80 backdrop-blur-sm rounded-3xl border border-white/5 flex flex-col shadow-xl overflow-hidden ${isWidget ? 'xl:col-span-4 h-[600px]' : 'max-w-4xl mx-auto h-[700px]'}`}>
      
      {/* CABECERA DEL CHAT */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-emerald-400/20 rounded-full flex items-center justify-center border border-emerald-400/30">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#001a17] rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-widest text-sm leading-tight">Lobby General</h3>
            <p className="text-[10px] text-emerald-400 font-bold tracking-wider">ONLINE</p>
          </div>
        </div>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar flex flex-col">
        {mensajes.map((msg) => {
          const isMe = msg.nombre === nombreUsuario;
          const numLikes = msg.likes ? msg.likes.length : 0;
          const meGusta = msg.likes && msg.likes.includes(nombreUsuario);

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              
              {/* AVATAR Y BANDERA */}
              <div className="relative flex-shrink-0">
                <img src={msg.avatar} alt="avatar" className={`w-10 h-10 rounded-full border border-white/10 bg-gray-800 ${isMe ? 'border-emerald-400/50' : ''}`} />
                <span className="absolute -bottom-1 -right-1 text-xs drop-shadow-md">{msg.bandera}</span>
              </div>

              {/* BURBUJA DE MENSAJE */}
              <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                
                {/* Nombre y hora */}
                <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-bold text-white">{msg.nombre}</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                    {msg.fecha ? new Date(msg.fecha.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl shadow-sm relative group ${isMe ? 'bg-emerald-400/20 text-white rounded-tr-none border border-emerald-400/20' : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'}`}>
                  
                  {/* CITAR / RESPONDER (Si existe) */}
                  {msg.respuestaA && (
                    <div className="bg-black/30 border-l-4 border-emerald-400 p-2 rounded mb-2 text-xs text-gray-300">
                      <span className="font-bold text-emerald-400 block mb-0.5">@{msg.respuestaA.nombre}</span>
                      <p className="truncate opacity-80">{msg.respuestaA.texto || "🖼️ Imagen"}</p>
                    </div>
                  )}

                  {/* IMAGEN / GIF (Si existe) */}
                  {msg.imagenUrl && (
                    <img src={msg.imagenUrl} alt="Sticker" className="rounded-xl max-w-full w-48 mb-2 shadow-md" />
                  )}

                  {/* TEXTO */}
                  {msg.texto && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.texto}</p>}

                  {/* BOTONES INTERACTIVOS (Like y Responder) */}
                  <div className={`flex items-center gap-3 mt-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    
                    {/* Botón Like */}
                    <button 
                      onClick={() => toggleLike(msg.id, msg.likes)}
                      className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${meGusta ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                    >
                      <svg className={`w-3.5 h-3.5 ${meGusta ? 'fill-current' : 'fill-none'} stroke-current`} viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      {numLikes > 0 && <span>{numLikes}</span>}
                    </button>

                    {/* Botón Responder */}
                    <button 
                      onClick={() => setMensajeRespondiendo(msg)}
                      className="text-[10px] text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                      Responder
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
        {/* Anclaje invisible para hacer auto-scroll */}
        <div ref={finalChatRef}></div>
      </div>

      {/* ÁREA DE ESCRITURA */}
      <div className="p-4 bg-black/20 border-t border-white/5 shrink-0 relative">
        
        {/* BANNER "Respondiendo a..." */}
        {mensajeRespondiendo && (
          <div className="mb-2 bg-emerald-400/10 border border-emerald-400/30 px-3 py-2 rounded-lg flex justify-between items-center text-xs">
            <div className="truncate text-gray-300">
              <span className="font-bold text-emerald-400 mr-2">Respondiendo a @{mensajeRespondiendo.nombre}:</span>
              {mensajeRespondiendo.texto || "🖼️ Imagen"}
            </div>
            <button onClick={() => setMensajeRespondiendo(null)} className="text-gray-400 hover:text-white ml-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        )}

        {/* POPUP DE STICKERS (Aparece al darle a la carita sonriente) */}
        {mostrarStickers && (
          <div className="absolute bottom-20 left-4 bg-[#00241f] border border-emerald-400/30 p-3 rounded-2xl shadow-2xl z-20 w-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Stickers Tech</span>
              <button onClick={() => setMostrarStickers(false)} className="text-gray-400 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {stickers.map((url, i) => (
                <img 
                  key={i} 
                  src={url} 
                  onClick={() => enviarSticker(url)}
                  className="w-full h-16 object-cover rounded-lg cursor-pointer hover:scale-105 hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all" 
                  alt="Sticker" 
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={enviarMensaje} className="flex gap-2">
          {/* Botón de Stickers */}
          <button 
            type="button"
            onClick={() => setMostrarStickers(!mostrarStickers)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-colors flex-shrink-0 ${mostrarStickers ? 'bg-emerald-400 border-emerald-400 text-black' : 'bg-[#00241f] border-gray-700 text-gray-400 hover:text-emerald-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>

          <input 
            type="text" 
            value={nuevoMensaje} 
            onChange={(e) => setNuevoMensaje(e.target.value)} 
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-[#00241f] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 transition" 
          />
          <button type="submit" className="bg-emerald-400 text-black font-black px-6 py-3 rounded-xl hover:bg-emerald-300 transition uppercase tracking-widest text-xs">
            Enviar
          </button>
        </form>
      </div>

    </div>
  );
}

export default VistaChatGlobal;
