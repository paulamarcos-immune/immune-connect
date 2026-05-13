import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';

function VistaChatGlobal({ nombreUsuario, paisUsuario, banderaActual, avatarConfig, getAvatarUrl, isWidget }) {
  const [mensaje, setMensaje] = useState("");
  const [chat, setChat] = useState([]);
  const [mensajesOcultos, setMensajesOcultos] = useState([]);
  const [msgMenuAbierto, setMsgMenuAbierto] = useState(null);
  const chatContainerRef = useRef(null);

  // Cargar mensajes desde Firebase
  useEffect(() => {
    const q = query(collection(db, "mensajes"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mensajesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChat(mensajesData);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll hacia abajo
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    await addDoc(collection(db, "mensajes"), {
      nombre: nombreUsuario,
      sede: `${paisUsuario} ${banderaActual}`,
      texto: mensaje,
      avatar: getAvatarUrl(avatarConfig),
      fecha: serverTimestamp()
    });
    setMensaje("");
  };

  const borrarMensaje = async (msgId, tipo) => {
    if (tipo === 'todos') {
      const msgABorrar = chat.find(m => m.id === msgId);
      if (msgABorrar && msgABorrar.nombre === nombreUsuario) {
        try { await deleteDoc(doc(db, "mensajes", msgId)); } 
        catch (error) { console.error("Error al borrar:", error); }
      } else { alert("Solo puedes borrar tus propios mensajes para todos."); }
    } else { setMensajesOcultos([...mensajesOcultos, msgId]); }
    setMsgMenuAbierto(null);
  };

  const borrarTodoElChat = async () => {
    if (window.confirm("¿Vaciar el chat por completo para todos?")) {
      try { for (const msg of chat) { await deleteDoc(doc(db, "mensajes", msg.id)); } } 
      catch (error) { console.error("Error:", error); }
    }
  };

  const chatFiltrado = chat.filter(msg => !mensajesOcultos.includes(msg.id));

  // isWidget adapta el tamaño dependiendo de si estamos en el "Inicio" o en la vista completa "Chat Global"
  return (
    <div className={`flex flex-col h-full ${isWidget ? 'min-h-[600px] xl:col-span-4' : 'max-w-4xl mx-auto h-[700px] animate-in fade-in zoom-in-95 duration-300 w-full'}`}>
      <section className="bg-gradient-to-b from-[#003d35] to-[#00241f] rounded-3xl border border-emerald-400/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden flex flex-col h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="p-6 border-b border-white/5 shrink-0 z-10 relative flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-emerald-400">Comunidad Global</h3>
            <p className="text-xs text-gray-400 mt-1">Chat en tiempo real</p>
          </div>
          <button onClick={borrarTodoElChat} className="text-xs text-red-400 hover:text-red-300 transition uppercase font-bold tracking-wider relative z-20">Vaciar</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 z-10 relative space-y-4 flex flex-col-reverse custom-scrollbar" ref={chatContainerRef}>
          {chatFiltrado.map((msg) => (
            <div key={msg.id} className="flex gap-3 hover:bg-white/5 transition p-2 rounded-xl relative group">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0 border border-white/10 overflow-hidden">
                <img src={msg.avatar?.startsWith('http') ? msg.avatar : `https://api.dicebear.com/9.x/avataaars/svg?seed=${msg.avatar || 'Alex'}`} alt="avatar" />
              </div>
              <div className="flex-1 bg-black/20 p-3 rounded-2xl rounded-tl-none border border-white/5 relative">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-xs text-emerald-400">{msg.nombre} <span className="text-gray-500 font-normal ml-1 text-[10px]">{msg.sede}</span></h4>
                  <div className="relative">
                    <button onClick={() => setMsgMenuAbierto(msgMenuAbierto === msg.id ? null : msg.id)} className="text-gray-500 hover:text-white text-xs px-1 font-bold">•••</button>
                    {msgMenuAbierto === msg.id && (
                      <div className="absolute right-0 mt-1 bg-[#001a17] border border-white/10 rounded-lg shadow-xl py-1 z-30 w-32 text-xs">
                        <button onClick={() => borrarMensaje(msg.id, 'mi')} className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-gray-300">Borrar para mí</button>
                        {msg.nombre === nombreUsuario && <button onClick={() => borrarMensaje(msg.id, 'todos')} className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-red-400 font-bold">Borrar para todos</button>}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-snug">{msg.texto}</p>
              </div>
            </div>
          ))}
          {chatFiltrado.length === 0 && <div className="text-center text-gray-500 text-sm mt-10">Aún no hay mensajes. ¡Sé el primero!</div>}
        </div>

        <form onSubmit={enviarMensaje} className="p-4 bg-black/20 border-t border-white/5 flex gap-2 shrink-0 z-10 relative">
          <input type="text" value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 bg-[#001a17] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-400 transition" />
          <button type="submit" className="bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-cyan-300 transition uppercase text-xs">Enviar</button>
        </form>
      </section>
    </div>
  );
}

export default VistaChatGlobal;